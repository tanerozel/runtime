﻿using PrimeApps.Model.Entities.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrimeApps.Model.Repositories.Interfaces
{
    public interface IModuleProfileSettingRepository : IRepositoryBaseTenant
    {
        Task<ICollection<ModuleProfileSetting>> GetAllBasic();
        Task<int> Create(ModuleProfileSetting moduleProfileSetting);
        Task<ModuleProfileSetting> GetByIdBasic(int id);
        Task<int> Update(ModuleProfileSetting moduleProfileSetting);
        Task<int> DeleteSoft(ModuleProfileSetting moduleProfileSetting);
    }
}
