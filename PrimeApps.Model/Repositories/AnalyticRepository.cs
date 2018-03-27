﻿using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using PrimeApps.Model.Context;
using PrimeApps.Model.Entities.Application;
using PrimeApps.Model.Enums;
using PrimeApps.Model.Repositories.Interfaces;

namespace PrimeApps.Model.Repositories
{
    public class AnalyticRepository : RepositoryBaseTenant, IAnalyticRepository
    {
        public AnalyticRepository(TenantDBContext dbContext) : base(dbContext) { }

        public async Task<Analytic> GetById(int id)
        {
            var analytic = await DbContext.Analytics
                .Include(x => x.Shares)
                .Include(x => x.CreatedBy)
                .FirstOrDefaultAsync(x => !x.Deleted && x.Id == id);

            return analytic;
        }

        public async Task<ICollection<Analytic>> GetAll()
        {
            var analytics = await DbContext.Analytics
                .Include(x => x.Shares)
                .Include(x => x.CreatedBy)
                .Where(x => !x.Deleted)
                .OrderBy(x => x.CreatedAt)
                .ToListAsync();

            return analytics;
        }

        public async Task<ICollection<Analytic>> GetReports()
        {
            var analytics = await DbContext.Analytics
                .Where(x => !x.Deleted)
                .Where(x => x.SharingType == AnalyticSharingType.Everybody
                || x.Shares.Any(j => j.Id == CurrentUser.UserId))
                .OrderBy(x => x.CreatedAt)
                .ToListAsync();

            return analytics;
        }

        public async Task<int> Create(Analytic analytic)
        {
            DbContext.Analytics.Add(analytic);

            return await DbContext.SaveChangesAsync();
        }

        public async Task<int> Update(Analytic analytic)
        {
            return await DbContext.SaveChangesAsync();
        }

        public async Task<int> DeleteSoft(Analytic analytic)
        {
            analytic.Deleted = true;

            return await DbContext.SaveChangesAsync();
        }

        public async Task<int> DeleteHard(Analytic analytic)
        {
            DbContext.Analytics.Remove(analytic);

            return await DbContext.SaveChangesAsync();
        }

        public async Task<int> DeleteAnalyticShare(Analytic analytic, TenantUser user)
        {
            user.SharedAnalytics.Remove(analytic);

            return await DbContext.SaveChangesAsync();
        }
    }
}
