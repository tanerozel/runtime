﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace PrimeApps.Model.Entities.Studio
{
    [Table("app_settings")]
    public class AppDraftSetting
    {
        [JsonIgnore]
        [Column("app_id"), Key]
        public int AppId { get; set; }

        [Column("app_domain")]
        public string AppDomain { get; set; }

        [Column("auth_domain")]
        public string AuthDomain { get; set; }

        [Column("currency")]
        public string Currency { get; set; }

        [Column("culture")]
        public string Culture { get; set; }

        [Column("time_zone")]
        public string TimeZone { get; set; }

        [Column("language")]
        public string Language { get; set; }

        [Column("auth_theme", TypeName = "jsonb")]
        public string AuthTheme { get; set; }

        [Column("app_theme", TypeName = "jsonb")]
        public string AppTheme { get; set; }

        [Column("mail_sender_name")]
        public string MailSenderName { get; set; }

        [Column("mail_sender_email")]
        public string MailSenderEmail { get; set; }

        [Column("google_analytics_code")]
        public string GoogleAnalyticsCode { get; set; }

        [Column("tenant_operation_webhook")]
        public string TenantOperationWebhook { get; set; }

        public virtual AppDraft App { get; set; }
    }
}