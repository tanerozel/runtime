﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PrimeApps.Model.Context;
using PrimeApps.Model.Entities.Tenant;
using PrimeApps.Model.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PrimeApps.Model.Enums;
using PrimeApps.Model.Common;
using Newtonsoft.Json.Linq;

namespace PrimeApps.Model.Repositories
{
    public class DeploymentComponentRepository : RepositoryBaseTenant, IDeploymentComponentRepository
    {
        public DeploymentComponentRepository(TenantDBContext dbContext, IConfiguration configuration) : base(dbContext, configuration)
        {
        }

        public async Task<int> Count(int componentId)
        {
            return await DbContext.DeploymentsComponent
                .Where(x => !x.Deleted & x.ComponentId == componentId)
                .CountAsync();
        }

        public async Task<DeploymentComponent> Get(int id)
        {
            return await DbContext.DeploymentsComponent
                .Where(x => !x.Deleted && x.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<int> CurrentBuildNumber(int componentId)
        {
            return await DbContext.DeploymentsComponent
                .OrderByDescending(x => x.Id)
                .Where(x => x.ComponentId == componentId)
                .Select(x => x.BuildNumber)
                .FirstOrDefaultAsync();
        }

        public bool AvailableForDeployment(int componentId)
        {
            return DbContext.DeploymentsComponent
                .Count(x => x.ComponentId == componentId && x.Status == ReleaseStatus.Running && !x.Deleted) == 0;
        }

        public IQueryable<DeploymentComponent> Find(int componentId)
        {
            var deployments = DbContext.DeploymentsComponent
                .Include(x => x.Component)
                .Where(x => !x.Deleted & x.ComponentId == componentId)
                .OrderByDescending(x => x.BuildNumber);

            return deployments;
        }

        public async Task<int> Create(DeploymentComponent deployment)
        {
            DbContext.DeploymentsComponent.Add(deployment);
            return await DbContext.SaveChangesAsync();
        }

        public async Task<int> Update(DeploymentComponent deployment)
        {
            return await DbContext.SaveChangesAsync();
        }

        public async Task<int> Delete(DeploymentComponent deployment)
        {
            DbContext.DeploymentsComponent.Remove(deployment);
            return await DbContext.SaveChangesAsync();
        }
    }
}