---
title: Proxmox VM from Cloud-Init template with Terraform
created: 2025-12-22
published: 2025-12-22
updated: 2025-12-22
up:
related:
tags:
  - t/on/proxmox
  - t/on/terraform
  - t/on/homelab
summary:
publish: true
description: Deploying Proxmox VMs from Cloud-Init templates using Terraform
socialDescription:
socialImage:
---
## Goal

Spin up new Ubuntu VMs from a pre-configured Cloud-Init template using Terraform.

## Requirements

- **Proxmox VE**
- **Terraform**
- Terraform **access** to Proxmox configured ([[20251222 Setup Terraform to connect with proxmox]])
- Cloud-init VM **Template** available ([[20251113 Ubuntu Cloud-Init VM Template on Proxmox]])

## Steps

### Configuration

#### Define Variables (`variables.tf`)

```hcl
variable "proxmox_api_url" {
  description = "The URL for the Proxmox API"
  type        = string
}

variable "vm_ssh_key" {
  description = "The public SSH key for the VM user"
  type        = string
}

variable "vm_ip_address" {
  description = "The static IP for the VM (CIDR format)"
  type        = string
}

variable "gateway" {
  description = "The gateway IP address"
  type        = string
}

variable "nameserver" {
  description = "The nameserver IP address"
  type        = string
}

```

#### Provider and Resource Definition (`main.tf`)

The actual "juice" (clone from an existing template and configure Cloud-Init):

```hcl
terraform {
  required_providers {
    proxmox = {
      source  = "telmate/proxmox"
      version = "3.0.2-rc07"
    }
  }
}

provider "proxmox" {
  pm_api_url = var.proxmox_api_url
  pm_tls_insecure = true
}


resource "proxmox_vm_qemu" "test_vm_template" {
  vmid          = 100
  name          = "ubuntu-srv-01"
  target_node   = "pve-node-01"
  agent         = 1

  machine       = "q35"
  bios          = "ovmf"
  cpu { 
    cores       = 2
    type        = "x86-64-v2-AES"
  }
  memory        = 3072
  boot          = "order=scsi0"
  clone         = "ubuntu-noble-24-04-template"
  scsihw        = "virtio-scsi-single"
  vm_state      = "running"
  automatic_reboot = true
  tablet = false

  # Cloud-Init configuration
  ciupgrade  = true
  nameserver = var.nameserver
  ipconfig0  = "ip=${var.vm_ip_address},gw=${var.gateway}"
  skip_ipv6  = true
  # In a professinal env we should use a different user
  ciuser     = "root"
  sshkeys    = <<EOF
    ${var.vm_ssh_key}
    EOF

  efidisk {
    efitype = "4m"
    storage = "local-zfs"
    pre_enrolled_keys = true
  }

  disks {
    scsi {
      scsi0 {
        disk {
          storage = "local-zfs"
          size    = "35G" 
          discard = true
          iothread = true
          emulatessd = true
        }
      }
      scsi1 {
        cloudinit {
          storage = "local-zfs"
        }
      }
    }
  }

  network {
    id = 0
    bridge = "vmbr0"
    model  = "virtio"
  }
}

```

#### Assign values (`terraform.tfvars`)

Define the input variables

```hcl
# URL of the target Proxmox node
proxmox_api_url = "https://my.proxmox.target:8006/api2/json"
# Public key to connect to the new machine
vm_ssh_key      = "ssh-rsa AAAAB3Nza..."
# replace with the desired fixed IP/CIDR
vm_ip_address   = "192.168.1.12/24"
# replace with the desired gateway
gateway         = "..."
# replace with the desired DNS server
nameserver      = "..."
```

### Usage (provision the VM)

```bash
# Initialize
terraform init
# Plan (verify the resources to be created)
terraform plan
# Apply
terraform apply
```

Give the VM a minute to finish cloud-init setup, then:

```bash
ssh root@<VM_IP_ADDRESS> -i ~/.ssh/id_rsa
```


### Optional - Destroy the VM

Simply run:

```bash
terraform destroy
```

And the VM (and disks) will vanish.


