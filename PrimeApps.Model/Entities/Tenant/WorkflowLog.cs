﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PrimeApps.Model.Entities.Application
{
    [Table("workflow_logs")]
    public class WorkflowLog : BaseEntity
    {
        [Column("workflow_id"), ForeignKey("Workflow")]//, Index]
        public int WorkflowId { get; set; }

        [Column("module_id"), Required]//, Index]
        public int ModuleId { get; set; }

        [Column("record_id"), Required]//, Index]
        public int RecordId { get; set; }

        public virtual Workflow Workflow { get; set; }
    }
}