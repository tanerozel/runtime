﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using PrimeApps.Model.Context;

namespace PrimeApps.Model.Migrations.ConsoleDB
{
    [DbContext(typeof(StudioDBContext))]
    [Migration("20190213055904_ProfileAndColor")]
    partial class ProfileAndColor
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("public")
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.0-rtm-35687")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.AppCollaborator", b =>
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

                    b.Property<int>("Profile")
                        .HasColumnName("profile");

                    b.Property<int?>("TeamId")
                        .HasColumnName("team_id");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.Property<int?>("UserId")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("AppId");

                    b.HasIndex("CreatedById");

                    b.HasIndex("TeamId");

                    b.HasIndex("UpdatedById");

                    b.HasIndex("UserId");

                    b.ToTable("app_collaborators");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.AppDraft", b =>
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

                    b.Property<string>("Label")
                        .HasColumnName("label")
                        .HasMaxLength(400);

                    b.Property<string>("Logo")
                        .HasColumnName("logo");

                    b.Property<string>("Name")
                        .HasColumnName("name")
                        .HasMaxLength(50);

                    b.Property<int>("OrganizationId")
                        .HasColumnName("organization_id");

                    b.Property<int>("Status")
                        .HasColumnName("status");

                    b.Property<int>("TempletId")
                        .HasColumnName("templet_id");

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

                    b.HasIndex("Name");

                    b.HasIndex("OrganizationId");

                    b.HasIndex("TempletId");

                    b.HasIndex("UpdatedAt");

                    b.HasIndex("UpdatedById");

                    b.ToTable("apps");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.AppDraftSetting", b =>
                {
                    b.Property<int>("AppId")
                        .HasColumnName("app_id");

                    b.Property<string>("AppDomain")
                        .HasColumnName("app_domain");

                    b.Property<string>("AppTheme")
                        .HasColumnName("app_theme")
                        .HasColumnType("jsonb");

                    b.Property<string>("AuthDomain")
                        .HasColumnName("auth_domain");

                    b.Property<string>("AuthTheme")
                        .HasColumnName("auth_theme")
                        .HasColumnType("jsonb");

                    b.Property<string>("Culture")
                        .HasColumnName("culture");

                    b.Property<string>("Currency")
                        .HasColumnName("currency");

                    b.Property<string>("GoogleAnalyticsCode")
                        .HasColumnName("google_analytics_code");

                    b.Property<string>("Language")
                        .HasColumnName("language");

                    b.Property<string>("MailSenderEmail")
                        .HasColumnName("mail_sender_email");

                    b.Property<string>("MailSenderName")
                        .HasColumnName("mail_sender_name");

                    b.Property<string>("TenantOperationWebhook")
                        .HasColumnName("tenant_operation_webhook");

                    b.Property<string>("TimeZone")
                        .HasColumnName("time_zone");

                    b.HasKey("AppId");

                    b.ToTable("app_settings");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.ConsoleUser", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnName("id");

                    b.HasKey("Id");

                    b.ToTable("users");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.Deployment", b =>
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

                    b.Property<DateTime>("EndTime")
                        .HasColumnName("end_time");

                    b.Property<DateTime>("StartTime")
                        .HasColumnName("start_time");

                    b.Property<int>("Status")
                        .HasColumnName("status");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasColumnName("version");

                    b.HasKey("Id");

                    b.HasIndex("AppId");

                    b.HasIndex("CreatedById");

                    b.HasIndex("EndTime");

                    b.HasIndex("StartTime");

                    b.HasIndex("Status");

                    b.HasIndex("UpdatedById");

                    b.ToTable("deployments");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.Organization", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<string>("Color")
                        .HasColumnName("color");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnName("created_at");

                    b.Property<int>("CreatedById")
                        .HasColumnName("created_by");

                    b.Property<bool>("Default")
                        .HasColumnName("default");

                    b.Property<bool>("Deleted")
                        .HasColumnName("deleted");

                    b.Property<string>("Icon")
                        .HasColumnName("icon")
                        .HasMaxLength(200);

                    b.Property<string>("Label")
                        .IsRequired()
                        .HasColumnName("label")
                        .HasMaxLength(200);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasMaxLength(50);

                    b.Property<int>("OwnerId")
                        .HasColumnName("owner_id");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.HasKey("Id");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("CreatedById");

                    b.HasIndex("Deleted");

                    b.HasIndex("Label");

                    b.HasIndex("Name");

                    b.HasIndex("OwnerId");

                    b.HasIndex("UpdatedAt");

                    b.HasIndex("UpdatedById");

                    b.ToTable("organizations");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.OrganizationUser", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnName("user_id");

                    b.Property<int>("OrganizationId")
                        .HasColumnName("organization_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnName("created_at");

                    b.Property<int>("CreatedById")
                        .HasColumnName("created_by");

                    b.Property<bool>("Deleted")
                        .HasColumnName("deleted");

                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<int>("Role")
                        .HasColumnName("role");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.HasKey("UserId", "OrganizationId");

                    b.HasAlternateKey("Id");

                    b.HasIndex("CreatedById");

                    b.HasIndex("OrganizationId");

                    b.HasIndex("UpdatedById");

                    b.HasIndex("UserId");

                    b.ToTable("organization_users");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.Team", b =>
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

                    b.Property<string>("Icon")
                        .HasColumnName("icon")
                        .HasMaxLength(200);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasMaxLength(50);

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

                    b.HasIndex("OrganizationId");

                    b.HasIndex("UpdatedAt");

                    b.HasIndex("UpdatedById");

                    b.ToTable("teams");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.TeamUser", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnName("user_id");

                    b.Property<int>("TeamId")
                        .HasColumnName("team_id");

                    b.HasKey("UserId", "TeamId");

                    b.HasIndex("TeamId");

                    b.HasIndex("UserId");

                    b.ToTable("team_users");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.Templet", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id");

                    b.Property<int>("CategoryId")
                        .HasColumnName("category_id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnName("created_at");

                    b.Property<int>("CreatedById")
                        .HasColumnName("created_by");

                    b.Property<bool>("Deleted")
                        .HasColumnName("deleted");

                    b.Property<string>("Description")
                        .HasColumnName("description")
                        .HasMaxLength(4000);

                    b.Property<string>("Image")
                        .HasColumnName("image");

                    b.Property<string>("Label")
                        .HasColumnName("label")
                        .HasMaxLength(400);

                    b.Property<string>("Logo")
                        .HasColumnName("logo");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("CreatedById");

                    b.HasIndex("Deleted");

                    b.HasIndex("UpdatedAt");

                    b.HasIndex("UpdatedById");

                    b.ToTable("templets");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.TempletCategory", b =>
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

                    b.Property<string>("Image")
                        .HasColumnName("image");

                    b.Property<string>("Label")
                        .HasColumnName("label")
                        .HasMaxLength(400);

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnName("updated_at");

                    b.Property<int?>("UpdatedById")
                        .HasColumnName("updated_by");

                    b.HasKey("Id");

                    b.HasIndex("CreatedAt");

                    b.HasIndex("CreatedById");

                    b.HasIndex("Deleted");

                    b.HasIndex("UpdatedAt");

                    b.HasIndex("UpdatedById");

                    b.ToTable("templet_categories");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.AppCollaborator", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.AppDraft", "AppDraft")
                        .WithMany("Collaborators")
                        .HasForeignKey("AppId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.Team", "Team")
                        .WithMany()
                        .HasForeignKey("TeamId");

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "ConsoleUser")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.AppDraft", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.Templet", "Templet")
                        .WithMany()
                        .HasForeignKey("TempletId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.AppDraftSetting", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.AppDraft", "App")
                        .WithOne("Setting")
                        .HasForeignKey("PrimeApps.Model.Entities.Console.AppDraftSetting", "AppId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.Deployment", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.AppDraft", "AppDraft")
                        .WithMany("Deployments")
                        .HasForeignKey("AppId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.Organization", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.OrganizationUser", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.Organization", "Organization")
                        .WithMany("OrganizationUsers")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "ConsoleUser")
                        .WithMany("UserOrganizations")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.Team", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.Organization", "Organization")
                        .WithMany("Teams")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.TeamUser", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.Team", "Team")
                        .WithMany("TeamUsers")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "ConsoleUser")
                        .WithMany("UserTeams")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.Templet", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.TempletCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });

            modelBuilder.Entity("PrimeApps.Model.Entities.Console.TempletCategory", b =>
                {
                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("PrimeApps.Model.Entities.Console.ConsoleUser", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedById");
                });
#pragma warning restore 612, 618
        }
    }
}
