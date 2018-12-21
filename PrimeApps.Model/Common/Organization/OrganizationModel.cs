﻿using Newtonsoft.Json;
using PrimeApps.Model.Common.Team;
using PrimeApps.Model.Entities.Console;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace PrimeApps.Model.Common.Organization
{
    public class OrganizationModel
    {
        [JsonProperty("id"), DataMember(Name = "id")]
        public int Id { get; set; }

        [JsonProperty("name"), DataMember(Name = "name"), Required]
        public string Name { get; set; }

        [JsonProperty("icon"), DataMember(Name = "icon")]
        public string Icon { get; set; }

        [JsonProperty("owner_id"), DataMember(Name = "owner_id")]
        public int OwnerId { get; set; }

        [JsonProperty("teams"), DataMember(Name = "teams")]
        public ICollection<TeamModel> Teams { get; set; }

        [JsonProperty("user"), DataMember(Name = "user")]
        public ICollection<OrganizationUserModel> Users { get; set; }

        [JsonProperty("apps"), DataMember(Name = "apps")]
        public ICollection<AppDraft> Apps { get; set; }
    }
}