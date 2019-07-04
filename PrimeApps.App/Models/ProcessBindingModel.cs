﻿using PrimeApps.Model.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using PrimeApps.Model.Common.Annotations;
using PrimeApps.Model.Common.Record;

namespace PrimeApps.App.Models
{
    public class ProcessBindingModel
    {
        [Required, Range(1, int.MaxValue)]
        public int ModuleId { get; set; }

        [Required, Range(0, int.MaxValue)]
        public int UserId { get; set; }

        [Required, StringLength(200)]
        public string Name { get; set; }

        public string Profiles { get; set; }

        [Required]
        public WorkflowFrequency Frequency { get; set; }

        [Required]
        public ProcessApproverType ApproverType { get; set; }

        [Required]
        public ProcessTriggerTime TriggerTime { get; set; }
        
        public string ApproverField { get; set; }

        public bool Active { get; set; }

        [RequiredCollection]
        public string[] Operations { get; set; }

        public List<Filter> Filters { get; set; }

        public List<ApproversBindingModel> Approvers { get; set; }
    }

    public class ApproversBindingModel
    {
        public short Order { get; set; }

        public int UserId { get; set; }
    }
}