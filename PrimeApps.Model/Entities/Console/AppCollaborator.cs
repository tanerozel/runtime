﻿using System.ComponentModel.DataAnnotations.Schema;
using PrimeApps.Model.Enums;

namespace PrimeApps.Model.Entities.Console
{
    [Table("app_collaborators")]
    public class AppCollaborator : BaseEntity
    {
        [Column("app_id"), ForeignKey("AppDraft")]
        public int AppId { get; set; }

        [Column("user_id"), ForeignKey("ConsoleUser")]
        public int? UserId { get; set; }

        [Column("team_id"), ForeignKey("Team")]
        public int? TeamId { get; set; }

        [Column("role")]
        public ApplicationRole Role { get; set; }

        public virtual AppDraft AppDraft { get; set; }

        public virtual ConsoleUser ConsoleUser { get; set; }

        public virtual Team Team { get; set; }
    }
}