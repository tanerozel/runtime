﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace PrimeApps.Model.Entities.Application
{
    /// <summary>
    /// Contains Profiles for Users
    /// </summary>
    [Table("profiles")]
    public class Profile : BaseEntity
    {
        public Profile()
        {
            Permissions = new List<ProfilePermission>();
        }

        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("has_admin_rights")]
        public bool HasAdminRights { get; set; }

        [Column("send_email")]
        public bool SendEmail { get; set; }

        [Column("send_sms")]
        public bool SendSMS { get; set; }

        [Column("lead_convert")]
        public bool LeadConvert { get; set; }

        [Column("export_data")]
        public bool ExportData { get; set; }

        [Column("import_data")]
        public bool ImportData { get; set; }

        [Column("word_pdf_download")]
        public bool WordPdfDownload { get; set; }

        [Column("document_search")]
        public bool DocumentSearch { get; set; }

        [Column("business_intelligence")]
        public bool BusinessIntelligence { get; set; }

        [Column("tasks")]
        public bool Tasks { get; set; }

        [Column("calendar")]
        public bool Calendar { get; set; }

        [Column("newsfeeed")]
        public bool Newsfeed { get; set; }

        [Column("is_persistent")]
        public bool IsPersistent { get; set; }

        [Column("report")]
        public bool Report { get; set; }

        [Column("dashboard")]
        public bool Dashboard { get; set; }

        [Column("home")]
        public bool Home { get; set; }

	    [Column("collective_annual_leave")]
	    public bool CollectiveAnnualLeave { get; set; }

		[Column("startpage")]
        public string StartPage { get; set; }

        [Column("migration_id")]
        public string MigrationId { get; set; }

        public virtual IList<ProfilePermission> Permissions { get; set; }

        [InverseProperty("Profile")]
        public virtual IList<TenantUser> Users { get; set; }

    }
}