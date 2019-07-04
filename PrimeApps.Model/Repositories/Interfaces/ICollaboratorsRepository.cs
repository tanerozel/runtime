﻿using PrimeApps.Model.Common;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using PrimeApps.Model.Entities.Studio;

namespace PrimeApps.Model.Repositories.Interfaces
{
    public interface ICollaboratorsRepository : IRepositoryBaseStudio
    {
        Task<bool> CheckUserAddedMultipleTimes(int userId, int organizationId, int appId, bool withTeam = false);
        Task<List<AppCollaborator>> GetByAppId(int appId);
        List<AppCollaborator> GetByUserId(int userId, int organizationId, int? appId);
        Task<int> AppCollaboratorAdd(AppCollaborator appCollaborator);
        Task<int> Delete(AppCollaborator appCollaborator);
        Task<AppCollaborator> GetById(int id);
        Task<int> Update(AppCollaborator appCollaborator);
    }
}