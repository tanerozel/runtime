﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PrimeApps.Model.Enums;

namespace PrimeApps.Model.Entities.Platform
{
    [Table("releases")]
    public class Release : BaseEntity
    {
        [Column("app_id"), ForeignKey("App")]
        public int? AppId { get; set; }
        
        [Column("tenant_id"), ForeignKey("Tenant")]
        public int? TenantId { get; set; }

        [Column("status"), Required]
        public ReleaseStatus Status { get; set; }

        [Column("version"), Required]
        public string Version { get; set; }

        [Column("start_time"), Required]
        public DateTime StartTime { get; set; }

        [Column("end_time")]
        public DateTime EndTime { get; set; }

        [Column("settings", TypeName = "jsonb")]
        public string Settings { get; set; }

        public virtual App App { get; set; }
        
        public virtual Tenant Tenant { get; set; }
    }
}