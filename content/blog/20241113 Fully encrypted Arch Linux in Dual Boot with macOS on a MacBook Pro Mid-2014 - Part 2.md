---
title: Fully encrypted Arch Linux in Dual Boot with macOS on a MacBook Pro Mid-2014 - Part 2
created: 2024-11-13
published: 2024-11-13
updated: 2025-12-21
up:
related:
tags:
  - t/on/dual_boot
  - t/on/linux
  - t/on/macos
  - t/on/disk_partitioning
summary:
publish: true
description: Disk Partitioning and Encryption
---
![[file-20251219183345299.jpg]]
Welcome to Part 2 of my multi-part guide on **Installing Arch Linux alongside macOS on a Mid-2014 MacBook Pro** with full disk encryption. 

In this part, I’ll walk through **partitioning** and **encrypting** the hard drive—for me, one of the trickier stages in the installation process!

---
Navigation:
* **[Start here first!]** **Part 1** - [[20241112 Fully encrypted Arch Linux in Dual Boot with macOS on a MacBook Pro Mid-2014 - Part 1|Preparing MacOS, Starting Arch Installation and Configuring Wireless Adapter]]
* [This one] **Part 2** - Disk Partitioning and Encryption
* **Part 3** - [[20241114 Fully encrypted Arch Linux in Dual Boot with macOS on a MacBook Pro Mid-2014 - Part 3|Base Arch Linux Installation]]
---

## Disk Partitioning and Encryption - Second Challenge!

Partitioning can be complex, especially when balancing dual-boot requirements with encryption. This section details the second big challenge (first challenge in Part 1) I faced in this process.

### The EFI Boot Partition Issue

Originally, I planned to re-use the existing ~200MB EFI system partition ([[20241112 Fully encrypted Arch Linux in Dual Boot with macOS on a MacBook Pro Mid-2014 - Part 1#Shrink MacOS partition|Shrink MacOS partition]] in Part 1) to boot Arch Linux as well. However, during the initial ramdisk generation step with [mkinitcpio](https://wiki.archlinux.org/title/Mkinitcpio) (more on this in Part 3), the EFI partition quickly ran out of space, causing the process to fail.

After some research, I discovered resizing the EFI partition carried a risk of corrupting the macOS installation. So, a better approach was to create a dedicated second EFI partition for Arch Linux, which is exactly what I did.

> Have any alternative suggestions? I’d love to hear them in the comments! Disk partitioning approaches vary widely, and I’m interested in learning new approaches.

### LVM and Disk Encryption

I also decided to use (and learn!) [Logical Volume Management](https://en.wikipedia.org/wiki/Logical_volume_management) (LVM) along with disk encryption. Here’s why:

**LVM** allows for:
- Flexibility in resizing partitions (or “logical volumes”) more easily than with traditional partitioning methods.
- Future growth and reconfiguration potential, such as adding partitions or resizing them as needs change.
- Good integration with encryption (covered below).

**Disk Encryption** because:
- It ensures all data is protected. Without encryption, the data could be easily read if someone accessed your hard drive directly.
- By encrypting the full LVM Volume Group, all partitions added to it are encrypted by default.

With LVM and encryption set up, inside the Volume Group, I’ll create `root` (for the system root), `home` (for user data), and `swap` partitions.

### The Big Picture

The final partition scheme will look something like this (with approximate sizes):

![[image 8 4.png]]

> If you are not going for dual boot and plan to remove MacOS completely: delete the 200MB EFI and APFS partitions in the “Disk Partitioning” section. Then, expand the root and home partitions to use the full disk.


Let's get to work!

### Disk Partitioning

> If you are not going for dual boot and plan to remove MacOS completely:  After Step 2.b below, delete (`d` command) the 200MB EFI (partition `1`) and APFS (partition `2`) partitions, similar to how the temporary 100GB partition is deleted. Adjust partition references accordingly. (partition `3`  and partition `4` , become partition `1` and `2`, respectively).

1. Identify your hard drive with `lsblk` or `fdisk -l`, in my case it is `sda`.
2. Start partitioning the disk by running `fdisk /dev/sda`. Changes won’t be saved until the last step (`w` command), so you can safely explore (`q` command for quitting without saving). Once inside fdisk:
	1. Print the  current partition table with  `p` and examine it.
	2. Delete the temporary 100GB partition created in Part 1 to make space. Use  `d`(elete) command and select the partition 3 when prompted. 
	3. Create the new EFI partion: `n` for new partition, leave `3` (the default) as the partition number, and keep the first sector default. For the last sector,  enter `+1G`  to allocate 1GB.
	4. Change the partition type to EFI: `t` for type, select partition 3, enter  `L` to list all types. Look for "EFI system" and take mental note of the number. Press `q` and enter the number (1 in my case)
	5. Create a new partition for LVM: `n` for new partition, leave `4`  as the partition number, and accept the default first and last sectors to fill remaining space.
	6. Change partition type to LVM: `t` , select partition 4, enter `L`, and select "Linux LVM" (44 in my case)
	7. Print the  partition table with  `p` and verify it includes four partitions. The `root`, `home` and `swap` partitions will be created within LVM next.
	8. If everything looks correct, commit the changes by pressing `w`.

### Creating encrypted LVM

1. Initialize and format `/dev/sda4` with LUKS (Linux Unified Key Setup): `cryptsetup luksFormat /dev/sda4`. Enter `YES` when asked if you are sure. Choose the encryption password (should be a strong and secure one!).
2. Unlock and mount the freshly created partition (`cryptlvm` is the name of the mounted container):  `cryptsetup open /dev/sda4 cryptlvm`. Enter password when prompted
3. Set up the LVM physical volume: `pvcreate /dev/mapper/cryptlvm`
4. Create the Volume Group (I named mine `macbooky`): `vgcreate macbooky /dev/mapper/cryptlvm`
5. Inside the Volume Group, create the logical volumes for `swap`, `root` and `home`:
```bash
lvcreate -L 8G macbooky -n swap
lvcreate -L 32G macbooky -n root
lvcreate -l 100%FREE macbooky -n home
```
6. Format and create the file systems:
```bash
mkfs.ext4 /dev/macbooky/root
mkfs.ext4 /dev/macbooky/home
mkswap /dev/macbooky/swap
```
7. Let’s also format the (non encrypted) boot partition:
```bash
mkfs.fat -F32 /dev/sda3
```
8. Mount all the file systems and activate the swap partition:
```bash
mount /dev/macbooky/root /mnt
mount --mkdir /dev/macbooky/home /mnt/home
mount --mkdir /dev/sda3 /mnt/boot
swapon /dev/macbooky/swap
```

And that’s it! With the disk configured, we’re ready to begin the actual Arch Linux installation.

## Base Arch Linux installation

_Continues in [[20241114 Fully encrypted Arch Linux in Dual Boot with macOS on a MacBook Pro Mid-2014 - Part 3|Part3]]…_
