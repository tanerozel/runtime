﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using PrimeApps.Model.Enums;

namespace PrimeApps.Model.Entities.Application
{
    [Table("workflow_filters")]
    public class WorkflowFilter : BaseEntity
    {
        [JsonIgnore]
        [Column("workflow_id"), ForeignKey("Workflow")]//, Index]
        public int WorkflowId { get; set; }

        [Column("field"), MaxLength(120), Required]
        public string Field { get; set; }

        [Required]
        public Operator Operator { get; set; }

        [Required, MaxLength(100)]
        public string Value { get; set; }

        [Required]
        public int No { get; set; }

        public virtual Workflow Workflow { get; set; }
    }
}
