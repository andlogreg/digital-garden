---
title: Ubuntu Cloud-Init VM Template on Proxmox
created: 2025-11-13
published: 2025-11-13
updated: 2025-12-21
tags:
  - t/on/proxmox
  - t/on/homelab
publish: true
description: Create Proxmox Ubuntu Cloud-Init templates for fast VM deployments.
---

## Goal

Spin up new Ubuntu VMs fast using the official Cloud-Init images. These images simplify SSH keys, networking, user creation, and automation.

Unlike standard ISO installations, Cloud images are pre-installed and “cloud-ready,” allowing near-instant cloning and automated config without manual steps.

Two options are included:
- A VM template with "sane defaults" for cloning manually via the Proxmox UI  
- A minimal template meant for automation tools like Terraform

## Download Official Ubuntu Cloud Image

The official Ubuntu Cloud images already include the optimized kernel and cloud-init.  

Download the Ubuntu 24.04 (Noble Numbat) `.img` into Proxmox's ISO/template directory:

```bash
cd /var/lib/vz/template/iso
wget https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img
```

## Create and Configure VM Template

### Option A: VM Template with sane defaults (Web UI Optimized)

This version includes useful baseline settings: virtio drivers, DHCP networking, Q35 machine type, OVMF firmware, and qemu-guest-agent.

Perfect for cloning manually through Proxmox's web UI

```bash
# Create VM
qm create 9000 --name "ubuntu-noble-24-04-template" \
  --machine q35 --memory 2048 --cores 2 --cpu x86-64-v2-AES \
  --net0 virtio,bridge=vmbr0 --agent enabled=1 --tablet 0  \
  --bios ovmf --efidisk0 local-zfs:0,efitype=4m,pre-enrolled-keys=1,size=1 \
  --scsihw virtio-scsi-single

# Import the disk and attach it
qm importdisk 9000 noble-server-cloudimg-amd64.img local-zfs
qm set 9000 --scsi0 local-zfs:vm-9000-disk-1,discard=on,iothread=1,ssd=1

# Add the Cloud-Init drive and set boot options
qm set 9000 --scsi1 local-zfs:cloudinit
qm set 9000 --boot order=scsi0 --serial0 socket --vga serial0

# Set default network to DHCP so clones get an IP immediately
qm set 9000 --ipconfig0 ip=dhcp

# Convert to template
qm template 9000
```

### Option B: Barebones VM Template (Terraform Optimized)

Use this version when the VM will be fully configured by automation. Eg: Terraform will manage the full life cycle of the VM (CPU/RAM/disk settings, etc).

```bash
# Create a basic VM
qm create 9000 --name "ubuntu-noble-24-04-template"

# Import the disk
qm set 9000 --scsi0 local-zfs:0,import-from=/var/lib/vz/template/iso/noble-server-cloudimg-amd64.img

# Convert to template
qm template 9000
```

## Next

Once the template is created, clone it and apply Cloud-Init settings (SSH key, hostname, IP config, etc.) per VM. → ***Notes on this to be created soon... 👨‍💻***
