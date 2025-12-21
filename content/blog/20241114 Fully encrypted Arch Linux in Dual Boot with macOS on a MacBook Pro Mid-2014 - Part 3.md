---
title: Fully encrypted Arch Linux in Dual Boot with macOS on a MacBook Pro Mid-2014 - Part 3
created: 2024-11-14
published: 2024-11-14
updated: 2025-12-21
up:
related:
tags:
  - t/on/dual_boot
  - t/on/linux
  - t/on/macos
  - t/on/disk_partitioning
summary:
description: Getting the base Arch Linux installed
publish: true
---
![[file-20251219183345299.jpg]]
Welcome to Part 3 of my multi-part guide on **Installing Arch Linux alongside macOS on a Mid-2014 MacBook Pro** with full disk encryption.

With the hard drive partitioned and encrypted, it’s time to start the base installation of Arch Linux. By the end of this section, you’ll have a functional, minimal Arch Linux setup ready for customization and use.

---
Navigation:
* **[Start here first!]** **Part 1** - [[20241112 Fully encrypted Arch Linux in Dual Boot with macOS on a MacBook Pro Mid-2014 - Part 1|Preparing MacOS, Starting Arch Installation and Configuring Wireless Adapter]]
* **Part 2** - [[20241113 Fully encrypted Arch Linux in Dual Boot with macOS on a MacBook Pro Mid-2014 - Part 2|Disk Partitioning and Encryption]]
* [This one] **Part 3** - Base Arch Linux Installation
---

## Base Arch Linux installation

With partitions created and mounted, let’s install the essential Arch packages to get our system running.

### Bootstrap the system

1. Install essential Arch packages to the root partition:
```bash
pacstrap -K /mnt base linux linux-firmware
```
2. Generate the `fstab` file: 
```bash
genfstab -U /mnt >> /mnt/etc/fstab
```
3. Change the root into the new system:
```bash
arch-chroot /mnt
```

With this command, you’re effectively “entering” the new system environment (mounted at `/mnt`), allowing us to configure it as if we were (kind of) fully booted into it.

### Set system timezone

1. Find your timezone with:
```bash
ls /usr/share/zoneinfo
```
The structure is `/usr/share/zoneinfo/[Region]/[City]`. In my case it’s `Europe/Lisbon`.
2. Set the timezone (replace `Europe/Lisbon` with your location):
```bash
ln -sf /usr/share/zoneinfo/Europe/Lisbon /etc/localtime
```
3. Sync the hardware clock: 
```bash
hwclock --systohc
```


### Install essential packages

To create a basic yet usable system, install the following essential packages. (Feel free to adjust based on your preferences—e.g., using `nano` instead of `vim`.)

```bash
pacman -Syu vim which sudo man-db man-pages texinfo intel-ucode lvm2 broadcom-wl iwd
```

Many of these packages come recommended in the official Arch [installation guide](https://wiki.archlinux.org/title/Installation_guide#Install_essential_packages).

### Localization

1. To set your locale edit the file `/etc/locale.gen` (`vim /etc/locale.gen` ) and uncomment `en_US.UTF-8 UTF-8`  and any other needed [locales](https://wiki.archlinux.org/title/Locale)
2. Create the file `/etc/locale.conf` and set the respective `LANG`:
```
echo "LANG=en_US.UTF-8" > /etc/locale.conf
```
3. Generate the locales
```
locale-gen
```

### Networking

1. Set your hostname. I chose `macbooky`,  but you can name it as you prefer:
```bash
echo "macbooky" > /etc/hostname
```
2. I chose systemd-networkd as the network manager ([other options](https://wiki.archlinux.org/title/Network_configuration) are available, but this is simple and reliable for Arch). Enable it:
```bash
systemctl enable systemd-networkd.service
```
3. Enable DNS resolution:
```bash
systemctl enable systemd-resolved.service
```

### Configure mkinitcpio for Encryption Support

Edit `/etc/mkinitcpio.conf` to support encryption. Modify the `HOOKS` line as follows:

```
HOOKS=(base systemd autodetect microcode modconf kms keyboard sd-vconsole sd-encrypt block lvm2 filesystems fsck)
```

To improve TTY readability, set a larger font by creating `/etc/vconsole.conf`:

```bash
echo "FONT=latarcyrheb-sun32" > /etc/vconsole.conf
```

### Bootloader Configuration

1. Install `systemd-boot` in the boot partition:

```
bootctl --path=/boot install
bootctl update
```

2. Configure the bootloader by editing the file `/boot/loader/entries/arch.conf` (`vim /boot/loader/entries/arch.conf`) and adding the following:

```
title Arch Linux
linux /vmlinuz-linux
initrd /initramfs-linux.img
options rd.luks.name=<DEVICE-UUID>=<VOLUMEGROUP> root=/dev/VOLUMEGROUP/root rw
```

Replace `DEVICE-UUID` with the ID of the entire encrypted LVM partition. To get it, run the command `blkid`  and take note of the the device UUID of the partition with type `crypto_LUKS`.

Replace `VOLUMEGROUP` ( `macbooky` in my case). 

For me, the file becomes:

```
title Arch Linux
linux /vmlinuz-linux
initrd /initramfs-linux.img
options rd.luks.name=bla-bla-bla=macbooky root=/dev/macbooky/root rw
```

3. Add the following contents to the loader configuration file (`/boot/loader/loader.conf`):

```
timeout 5
default arch.conf
editor no
```

This sets a timeout of 5 seconds, sets the default entry to `arch.conf` and disables any edits and boot time (for security reasons).

### Build mkinitcipio

Finally run:

```
mkinitcipio -P
```

Make sure no errors appear (warnings are ok).

### Configure user accounts and passwords


1. Create your user (replace `YOUR_USER` with your desired username):
```bash
useradd -m YOUR_USER
```
2. Give your user root powers by adding it to the `wheels` group:
```bash
usermod -aG wheel YOUR_USER
```
3. Grant root privileges to the `wheels`. run `visudo` and uncomment the line that reads: `Uncomment to allow member of group wheel to execute any command `:
```
%whell ALL=(ALL:ALL) ALL
```
4. Set root passwd (use a secure password!): 
```bash
passwd
```
5. Ser your user password (use a secure password different from root!): 
```bash
passwd YOUR_USER
```

### Reboot!

You’re now ready for the first boot into Arch Linux!

1. Exit the chroot: 
```bash
exit
```
2. Unmount all partitions: 
```bash
umount -R /mnt
```
3. Reboot and remove the installation medium:
```bash
reboot
```

### In case of a failed boot

If your first boot fails due to configuration issues, not all hope is lost. You can still troubleshoot without starting over:

1. Boot again from the live usb stick
2. unlock the encrypted volume:
```
cryptsetup open /dev/sda4 cryptlvm
```
3. Mount the partitions:
```
mount /dev/macbooky/root /mnt
mount --mkdir /dev/macbooky/home /mnt/home
mount --mkdir /dev/sda3 /mnt/boot
swapon /dev/macbooky/swap
```
4. Change root into new system: 
```
arch-chroot /mnt
```
5. Fix what you suspect is broken and reboot again

If you're still stuck, feel free to reach out in the comments.

## First boot

1. On boot, you should see entries for both Arch Linux and macOS. Choose Arch Linux.
2. When prompted, enter your encryption password to unlock the LVM.
3. If all goes well, you’ll reach the login prompt, marking a successful installation! 😃

### Configure wireless adapter

Similarly to what was done during the installation process, we need to connect to the Wi-Fi (you'll only need to do this once):

1. Enable and start the `iwd` service:
```bash
sudo systemctl enable iwd
sudo systemctl start iwd
```

2. Run `iwctl`
3. Get you device name (probably it’ll be `wlan0`): 
```bash
device list
```
4. Put station in scan mode and list available networks:
```bash
station wlan0 scan
station wlan0 get-networks
```
5. Connect to your network (`SSID` is your network name. Quotes are required):
```bash
station wlan0 connect "SSID"
```
6. Confirm connection was succesfful:  `station wlan0 show`
7. `exit` from iwctl.

You're now connected to the network, but you’ll probably won’t have a connection to the internet because DNS resolution is not enabled. Let’s take care of that:

1. Get the network interface name (it’ll probably be `wlan0`):
```bash
ip link
```
2. Create a file in `/etc/systemd/network/25-wireless.network` with the following contents:
```
[Match]
Name=wlan0

[Network]
DHCP=yes
IgnoreCarrierLoss=3s 
```

3. Enable and start systemd-networkd and systemd-resolved:
```bash
sudo systemctl enable systemd-networkd.service
sudo systemctl start systemd-networkd.service
sudo systemctl enable systemd-resolved.service
sudo systemctl start systemd-resolved.service
```

Give it a few seconds and test connectivity by pinging google:

```bash
ping www.google.com
```


## Conclusions and next steps

And that’s it for now! 🎉 You now have a basic, functional Arch Linux setup. Upcoming steps that I still need to take core of include:

- **Setting up fan control** to prevent overheating (**Do not** do any heavy processing before getting this configured!)
- **Configuring macOS booting** from systemd-boot. As of now, if  MacOS is selected in the boot menu, it won't boot. The workroud for now: hold down the **Option (⌥)** key until the Apple logo appear and then select the MacOS boot partition.
- Installing a **Desktop Environment/Window Manager**. We need a graphical user interface for a fully usable system
- Configuring **firewall** for security
- … and anything else I feel like it 🙂

Let me know if you’d like more posts covering these next steps!

Thanks for following along! Feel free to ask questions or suggest improvements in the comments.