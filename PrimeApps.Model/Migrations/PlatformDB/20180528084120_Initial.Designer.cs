﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using PrimeApps.Model.Context;

namespace PrimeApps.Model.Migrations.PlatformDB
{
    [DbContext(typeof(PlatformDBContext))]
    [Migration("20180528084120_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.1.0-preview2-30571");

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.App", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnName("created_at");

                    b.Property<int>("CreatedById")
                        .HasColumnName("created_by");

                    b.Property<bool>("Deleted")
                        .HasColumnName("deleted");

                    b.Property<string>("Description")
                        .HasColumnName("description")
                        .HasMaxLength(4000);

                    b.Property<string>("Logo")
                        .HasColumnName("logo");

                    b.Property<string>("Name")
                        .HasColumnName("name")
                        .HasMaxLength(400);

                    b.Property<int?>("TemplateId")
                        .HasColumnName("template_id");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.Property<bool>("UseTenantSettings")
                        .HasColumnName("use_tenant_settings");

                    b.HasKey("Id");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("CreatedById");

                    b.HasIndex("Deleted");

                    b.HasIndex("Description");

                    b.HasIndex("Name");

                    b.HasIndex("TemplateId");

                    b.HasIndex("UpdatedAt");

                    b.HasIndex("UpdatedById");

                    b.HasIndex("UseTenantSettings");

                    b.ToTable("apps");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.AppSetting", b =>
                {
                    b.Property<int>("AppId")
                        .HasColumnName("app_id");

                    b.Property<string>("Color")
                        .HasColumnName("color");

                    b.Property<string>("Culture")
                        .HasColumnName("culture");

                    b.Property<string>("Currency")
                        .HasColumnName("currency");

                    b.Property<string>("Description")
                        .HasColumnName("description");

                    b.Property<string>("Domain")
                        .HasColumnName("domain");

                    b.Property<string>("Favicon")
                        .HasColumnName("favicon");

                    b.Property<string>("Image")
                        .HasColumnName("image");

                    b.Property<string>("Language")
                        .HasColumnName("language");

                    b.Property<string>("MailSenderEmail")
                        .HasColumnName("mail_sender_email");

                    b.Property<string>("MailSenderName")
                        .HasColumnName("mail_sender_name");

                    b.Property<string>("TimeZone")
                        .HasColumnName("time_zone");

                    b.Property<string>("Title")
                        .HasColumnName("title");

                    b.HasKey("AppId");

                    b.HasIndex("AppId");

                    b.HasIndex("Culture");

                    b.HasIndex("Currency");

                    b.HasIndex("Domain");

                    b.HasIndex("Language");

                    b.HasIndex("MailSenderEmail");

                    b.HasIndex("MailSenderName");

                    b.HasIndex("TimeZone");

                    b.ToTable("app_settings");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.ExchangeRate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime>("Date")
                        .HasColumnName("date");

                    b.Property<int>("Day")
                        .HasColumnName("day");

                    b.Property<decimal>("Eur")
                        .HasColumnName("eur");

                    b.Property<int>("Month")
                        .HasColumnName("month");

                    b.Property<decimal>("Usd")
                        .HasColumnName("usd");

                    b.Property<int>("Year")
                        .HasColumnName("year");

                    b.HasKey("Id");

                    b.HasIndex("Date");

                    b.HasIndex("Day");

                    b.HasIndex("Month");

                    b.HasIndex("Year");

                    b.ToTable("exchange_rates");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.Organization", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnName("created_at");

                    b.Property<int>("CreatedById")
                        .HasColumnName("created_by");

                    b.Property<bool>("Deleted")
                        .HasColumnName("deleted");

                    b.Property<string>("Name")
                        .HasColumnName("name")
                        .HasMaxLength(700);

                    b.Property<int>("OwnerId")
                        .HasColumnName("owner");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.HasKey("Id");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("CreatedById");

                    b.HasIndex("Deleted");

                    b.HasIndex("Id");

                    b.HasIndex("Name");

                    b.HasIndex("OwnerId");

                    b.HasIndex("UpdatedAt");

                    b.HasIndex("UpdatedById");

                    b.ToTable("organizations");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.OrganizationUser", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnName("user_id");

                    b.Property<int>("OrganizationId")
                        .HasColumnName("organization_id");

                    b.HasKey("UserId", "OrganizationId");

                    b.HasIndex("OrganizationId");

                    b.HasIndex("UserId");

                    b.ToTable("organization_users");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.PlatformUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnName("created_at");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnName("email");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnName("first_name");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnName("last_name");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.HasKey("Id");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("Email");

                    b.HasIndex("FirstName");

                    b.HasIndex("Id");

                    b.HasIndex("LastName");

                    b.HasIndex("UpdatedAt");

                    b.ToTable("users");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.PlatformUserSetting", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnName("user_id");

                    b.Property<string>("Culture")
                        .HasColumnName("culture");

                    b.Property<string>("Currency")
                        .HasColumnName("currency");

                    b.Property<string>("Language")
                        .HasColumnName("language");

                    b.Property<string>("Phone")
                        .HasColumnName("phone");

                    b.Property<string>("TimeZone")
                        .HasColumnName("time_zone");

                    b.HasKey("UserId");

                    b.HasIndex("Culture");

                    b.HasIndex("Currency");

                    b.HasIndex("Language");

                    b.HasIndex("Phone");

                    b.HasIndex("TimeZone");

                    b.ToTable("user_settings");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.PlatformWarehouse", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<bool>("Completed")
                        .HasColumnName("completed");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnName("created_at");

                    b.Property<int>("CreatedById")
                        .HasColumnName("created_by");

                    b.Property<string>("DatabaseName")
                        .HasColumnName("database_name");

                    b.Property<string>("DatabaseUser")
                        .HasColumnName("database_user");

                    b.Property<bool>("Deleted")
                        .HasColumnName("deleted");

                    b.Property<string>("PowerbiWorkspaceId")
                        .HasColumnName("powerbi_workspace_id");

                    b.Property<int>("TenantId")
                        .HasColumnName("tenant_id");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.HasKey("Id");

                    b.HasIndex("Completed");

                    b.HasIndex("CreatedById");

                    b.HasIndex("DatabaseName");

                    b.HasIndex("TenantId");

                    b.HasIndex("UpdatedById");

                    b.ToTable("warehouse");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.Team", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnName("created_at");

                    b.Property<int>("CreatedById")
                        .HasColumnName("created_by");

                    b.Property<bool>("Deleted")
                        .HasColumnName("deleted");

                    b.Property<string>("Name")
                        .HasColumnName("name")
                        .HasMaxLength(700);

                    b.Property<int>("OrganizationId")
                        .HasColumnName("organization_id");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.HasKey("Id");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("CreatedById");

                    b.HasIndex("Deleted");

                    b.HasIndex("Id");

                    b.HasIndex("Name");

                    b.HasIndex("OrganizationId");

                    b.HasIndex("UpdatedAt");

                    b.HasIndex("UpdatedById");

                    b.ToTable("teams");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.TeamApp", b =>
                {
                    b.Property<int>("AppId")
                        .HasColumnName("app_id");

                    b.Property<int>("TeamId")
                        .HasColumnName("team_id");

                    b.HasKey("AppId", "TeamId");

                    b.HasIndex("AppId");

                    b.HasIndex("TeamId");

                    b.ToTable("team_apps");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.TeamUser", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnName("user_id");

                    b.Property<int>("TeamId")
                        .HasColumnName("team_id");

                    b.Property<string>("Role")
                        .HasColumnName("role");

                    b.HasKey("UserId", "TeamId");

                    b.HasIndex("TeamId");

                    b.HasIndex("UserId");

                    b.ToTable("team_users");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.Tenant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<int>("AppId")
                        .HasColumnName("app_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnName("created_at");

                    b.Property<int>("CreatedById")
                        .HasColumnName("created_by");

                    b.Property<bool>("Deleted")
                        .HasColumnName("deleted");

                    b.Property<Guid>("GuidId")
                        .HasColumnName("guid_id");

                    b.Property<int>("OwnerId")
                        .HasColumnName("owner_id");

                    b.Property<string>("Title")
                        .HasColumnName("title");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.Property<bool>("UseUserSettings")
                        .HasColumnName("use_user_settings");

                    b.HasKey("Id");

                    b.HasIndex("AppId");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("CreatedById");

                    b.HasIndex("Deleted");

                    b.HasIndex("GuidId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("UpdatedAt");

                    b.HasIndex("UpdatedById");

                    b.HasIndex("UseUserSettings");

                    b.ToTable("tenants");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.TenantLicense", b =>
                {
                    b.Property<int>("TenantId")
                        .HasColumnName("tenant_id");

                    b.Property<int>("AnalyticsLicenseCount")
                        .HasColumnName("analytics_license_count");

                    b.Property<DateTime?>("DeactivatedAt")
                        .HasColumnName("deactivated_at");

                    b.Property<bool>("IsDeactivated")
                        .HasColumnName("is_deactivated");

                    b.Property<bool>("IsPaidCustomer")
                        .HasColumnName("is_paid_customer");

                    b.Property<bool>("IsSuspended")
                        .HasColumnName("is_suspended");

                    b.Property<int>("ModuleLicenseCount")
                        .HasColumnName("module_license_count");

                    b.Property<DateTime?>("SuspendedAt")
                        .HasColumnName("suspended_at");

                    b.Property<int>("UserLicenseCount")
                        .HasColumnName("user_license_count");

                    b.HasKey("TenantId");

                    b.HasIndex("DeactivatedAt");

                    b.HasIndex("IsDeactivated");

                    b.HasIndex("IsPaidCustomer");

                    b.HasIndex("IsSuspended");

                    b.HasIndex("SuspendedAt");

                    b.HasIndex("TenantId");

                    b.ToTable("tenant_licenses");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.TenantSetting", b =>
                {
                    b.Property<int>("TenantId")
                        .HasColumnName("tenant_id");

                    b.Property<string>("Culture")
                        .HasColumnName("culture");

                    b.Property<string>("Currency")
                        .HasColumnName("currency");

                    b.Property<string>("CustomColor")
                        .HasColumnName("custom_color");

                    b.Property<string>("CustomDescription")
                        .HasColumnName("custom_description");

                    b.Property<string>("CustomDomain")
                        .HasColumnName("custom_domain");

                    b.Property<string>("CustomFavicon")
                        .HasColumnName("custom_favicon");

                    b.Property<string>("CustomImage")
                        .HasColumnName("custom_image");

                    b.Property<string>("CustomTitle")
                        .HasColumnName("custom_title");

                    b.Property<bool>("HasSampleData")
                        .HasColumnName("has_sample_data");

                    b.Property<string>("Language")
                        .HasColumnName("language");

                    b.Property<string>("Logo")
                        .HasColumnName("logo");

                    b.Property<string>("MailSenderEmail")
                        .HasColumnName("mail_sender_email");

                    b.Property<string>("MailSenderName")
                        .HasColumnName("mail_sender_name");

                    b.Property<string>("TimeZone")
                        .HasColumnName("time_zone");

                    b.HasKey("TenantId");

                    b.HasIndex("Culture");

                    b.HasIndex("Currency");

                    b.HasIndex("CustomDomain");

                    b.HasIndex("Language");

                    b.HasIndex("MailSenderEmail");

                    b.HasIndex("MailSenderName");

                    b.HasIndex("TenantId");

                    b.HasIndex("TimeZone");

                    b.ToTable("tenant_settings");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.UserTenant", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnName("user_id");

                    b.Property<int>("TenantId")
                        .HasColumnName("tenant_id");

                    b.HasKey("UserId", "TenantId");

                    b.HasIndex("TenantId");

                    b.HasIndex("UserId");

                    b.ToTable("user_tenants");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.App", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.AppSetting", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.App", "App")
                        .WithOne("Setting")
                        .HasForeignKey("PrimeApps.Model.Entities.Platform.AppSetting", "AppId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.Organization", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.OrganizationUser", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "PlatformUser")
                        .WithMany("UserOrganizations")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.Organization", "Organization")
                        .WithMany("OrganizationUsers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.PlatformUserSetting", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "User")
                        .WithOne("Setting")
                        .HasForeignKey("PrimeApps.Model.Entities.Platform.PlatformUserSetting", "UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.PlatformWarehouse", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.Team", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.Organization", "Organization")
                        .WithMany("Teams")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.TeamApp", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.App", "App")
                        .WithMany("AppTeams")
                        .HasForeignKey("AppId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.Team", "Team")
                        .WithMany("TeamApps")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.TeamUser", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "PlatformUser")
                        .WithMany("UserTeams")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.Team", "Team")
                        .WithMany("TeamUsers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.Tenant", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.App", "App")
                        .WithMany("Tenants")
                        .HasForeignKey("AppId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "Owner")
                        .WithMany("TenantsAsOwner")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.TenantLicense", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.Tenant", "Tenant")
                        .WithOne("License")
                        .HasForeignKey("PrimeApps.Model.Entities.Platform.TenantLicense", "TenantId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.TenantSetting", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.Tenant", "Tenant")
                        .WithOne("Setting")
                        .HasForeignKey("PrimeApps.Model.Entities.Platform.TenantSetting", "TenantId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Platform.UserTenant", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Platform.Tenant", "Tenant")
                        .WithMany("TenantUsers")
                        .HasForeignKey("TenantId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Platform.PlatformUser", "PlatformUser")
                        .WithMany("TenantsAsUser")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
