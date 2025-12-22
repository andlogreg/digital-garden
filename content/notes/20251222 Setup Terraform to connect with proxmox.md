---
title: Setup Terraform to connect with proxmox
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
description: How to set up a Proxmox user and token for secure Terraform access.
socialDescription:
socialImage:
---
## Goal

Connect Proxmox Cluster with [telmate/proxmox](https://registry.terraform.io/providers/Telmate/proxmox/latest) Terraform provider using a dedicated service user and API token.

## Requirements

- Proxmox VE 
- Terraform (locally)
- SSH/CLI access to your Proxmox node(s)

> [!NOTE] Tested with Proxmox 8.4.1
> I haven't updated my cluster yet. When I do, verify these steps again.

## Steps

### Create a Terraform dedicated user in Proxox

Let's create a dedicated user (and role) to be used exclusively by Terraform to avoid using root credentials.

On a Proxmox node:

```bash
# Create role with the required permissions
pveum role add TerraformProv -privs "Datastore.AllocateSpace Datastore.AllocateTemplate Datastore.Audit Pool.Allocate Pool.Audit Sys.Audit Sys.Console Sys.Modify VM.Allocate VM.Audit VM.Clone VM.Config.CDROM VM.Config.Cloudinit VM.Config.CPU VM.Config.Disk VM.Config.HWType VM.Config.Memory VM.Config.Network VM.Config.Options VM.Monitor VM.Migrate VM.PowerMgmt SDN.Use"

# Create user (NOTE: replace with a strong password)
pveum user add my-terraform-prov@pve --password <password>

# Associate the role with the user
pveum aclmod / -user my-terraform-prov@pve -role TerraformProv
```

### Create API token for the Terraform user

To avoid authenticating with password let's create an API token:

```bash
# `--privsep=0` -> token inherits user permissions
pveum user token add my-terraform-prov@pve supersecrettoken --privsep=0
```

> [!NOTE] Take note of the token secret — it won’t be visible again.

### Configure Terraform Provider with the new credentials

I *can* set these in `main.tf`, but storing secrets in configurations files or git isn't a great idea...

Instead, export them as environment variables:

```bash
export PM_API_TOKEN_ID='my-terraform-prov@pve!supersecrettoken'
export PM_API_TOKEN_SECRET='...'
```

The Proxmox provider automatically picks these up.

## That's it!

Terraform can now authenticate with cluster and start provisioning. Working example → [[20251222 Proxmox VM from Cloud-Init template with Terraform]].
