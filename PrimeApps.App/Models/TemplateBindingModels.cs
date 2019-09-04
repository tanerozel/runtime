﻿using System.ComponentModel.DataAnnotations;
using PrimeApps.Model.Enums;
using System.Runtime.Serialization;
using System.Collections.Generic;


namespace PrimeApps.App.Models
{
    public class TemplateBindingModel
    {
        [Required]
        public TemplateType TemplateType { get; set; }

        public string ContentType { get; set; }

        [Required, StringLength(200)]
        public string Name { get; set; }

        [Required, StringLength(200)]
        public string Subject { get; set; }

        [Required, StringLength(30000)]
        public string Content { get; set; }

        [Required]
        public LanguageType Language { get; set; }

        public bool Active { get; set; }

        [StringLength(50)]
        public string Module { get; set; }

        public int Chunks { get; set; }

        public TemplateSharingType SharingType { get; set; }

        public List<int> Shares { get; set; }

        public List<TemplatePermissionsModel> Permissions { get; set; }
    }

    public class TemplatePermissionsModel
    {
        public int? Id { get; set; }

        public int ProfileId { get; set; }

        public TemplatePermissionType Type { get; set; }
    }


}