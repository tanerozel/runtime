﻿using Hangfire;
using Newtonsoft.Json.Linq;
using PrimeApps.App.Helpers;
using PrimeApps.App.Jobs.QueueAttributes;
using PrimeApps.Model.Context;
using PrimeApps.Model.Helpers;
using PrimeApps.Model.Repositories;
using PrimeApps.Model.Repositories.Interfaces;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using PrimeApps.Model.Common.Cache;
using PrimeApps.Model.Common.Notification;

namespace PrimeApps.App.Jobs.Reminder
{
    [ActivityQueue, AutomaticRetry(Attempts = 3)]
    public class Activity
    {
        /// <summary>
        /// Processes reminder object and classifies the type of the reminder.
        /// </summary>
        /// <param name="reminderMessage"></param>
        /// <returns>it will return false only when an error occured during the processing, not when the reminder revision is wrong or non-existant.</returns>
        public async Task<bool> Process(ReminderDTO reminderMessage)
        {
            Model.Entities.Application.Reminder reminder;
            bool status = false;
            try
            {
                using (var databaseContext = new TenantDBContext(reminderMessage.TenantId))
                {

                    using (var _reminderRepository = new ReminderRepository(databaseContext))
                    {
                        /// Get related reminder record from data store.
                        reminder = await _reminderRepository.GetById(Convert.ToInt32(reminderMessage.Id));

                        if (reminder == null) return true;

                        /// check if the message is still valid.
                        if (reminder.Rev != reminderMessage.Rev) return true;

                        string reminderType = reminder.ReminderType;

                        using (PlatformDBContext platformDbContext = new PlatformDBContext())
                        {
                            using (PlatformUserRepository platformUserRepository = new PlatformUserRepository(platformDbContext))
                            {


                                try
                                {
                                    switch (reminderType)
                                    {
                                        case "task":
                                            await Task(reminder, reminderMessage, platformUserRepository);
                                            break;
                                        case "event":
                                            await Event(reminder, reminderMessage, platformUserRepository);
                                            break;
                                        case "call":
                                            await Call(reminder, reminderMessage, platformUserRepository);
                                            break;
                                        default:
                                            break;
                                    }
                                    status = true;
                                }
                                catch (Exception ex)
                                {
                                    /// rollback the transaction and log error.
                                    ErrorHandler.LogError(ex, "Error while processing activity notification.");
                                    status = false;
                                }

                            }
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                ErrorHandler.LogError(ex, $"Reminder Process has failed while running id: {reminderMessage.Id} rev: {reminderMessage.Rev} tenant: {reminderMessage.TenantId}.");
                status = false;
            }

            return status;
        }

        /// <summary>
        /// Creates notifications for event typed activity records.
        /// </summary>
        private async Task Event(Model.Entities.Application.Reminder reminder, ReminderDTO reminderMessage, PlatformUserRepository platformUserRepository)
        {

            try
            {
                DateTime now = DateTime.UtcNow;
                DateTime reminderStart = reminder.ReminderStart;
                DateTime eventEnd = reminder.ReminderEnd;

                using (var dbContext = new TenantDBContext(reminderMessage.TenantId))
                {
                    using (var _userRepository = new UserRepository(dbContext))
                    {
                        var usr = await _userRepository.GetById((int)reminder.Owner);

                        string email = usr.Email;
                        string subject = reminder.Subject;

                        string userName = string.Format("{0} {1}", usr.FirstName, usr.LastName),
                        startDate = reminderStart.AddMinutes(reminder.TimeZoneOffset).ToString("dd.MM.yyyy HH:mm"),
                        endDate = eventEnd.AddMinutes(reminder.TimeZoneOffset).ToString("dd.MM.yyyy HH:mm");

                        var user = await platformUserRepository.Get(usr.Email);
                        var appUser = new UserItem
                        {
                           AppId = user.AppId,
                           TenantId = user.TenantId.Value,
                           Id = user.Id,
                           UserName = user.Email,
                           Email = user.Email
                        };

                        Email.Notification.Event(userName, subject, email, usr.Culture, startDate, endDate, user.AppId, appUser);
                        /// program notification email for the reminder date.


                    }
                }
            }
            catch (Exception ex)
            {
                ErrorHandler.LogError(ex, $"Reminder Event has failed while running id: {reminderMessage.Id} rev: {reminderMessage.Rev} tenant: {reminderMessage.TenantId}.");
            }
        }

        /// <summary>
        /// Creates notifications for call typed activity records.
        /// </summary>
        private async Task Call(Model.Entities.Application.Reminder reminder, ReminderDTO reminderMessage, PlatformUserRepository platformUserRepository)
        {


            try
            {
                DateTime now = DateTime.UtcNow;
                DateTime reminderStart = reminder.ReminderStart;
                DateTime eventEnd = reminder.ReminderEnd;



                using (var dbContext = new TenantDBContext(reminderMessage.TenantId))
                {
                    using (var _userRepository = new UserRepository(dbContext))
                    {
                        var usr = await _userRepository.GetById((int)reminder.Owner);

                        string email = usr.Email;
                        string subject = reminder.Subject;

                        string userName = string.Format("{0} {1}", usr.FirstName, usr.LastName),
                            startDate = reminderStart.AddMinutes(reminder.TimeZoneOffset).ToString("dd.MM.yyyy HH:mm");

                            var user = await platformUserRepository.Get(usr.Email);
                            var appUser = new UserItem
                            {
                                AppId = user.AppId,
                                TenantId = user.TenantId.Value,
                                Id = user.Id,
                                UserName = user.Email,
                                Email = user.Email
                            };
                            Email.Notification.Call(userName, subject, email, usr.Culture, startDate,  user.AppId, appUser);

                        /// program notification email for the reminder date.

                    };
                }
            }
            catch (Exception ex)
            {
                ErrorHandler.LogError(ex, $"Reminder Call has failed while running id: {reminderMessage.Id} rev: {reminderMessage.Rev} tenant: {reminderMessage.TenantId}.");
            }

        }

        /// <summary>
        /// Creates notifications for task typed activity records.
        /// </summary>
        private async Task Task(Model.Entities.Application.Reminder reminder, ReminderDTO reminderMessage, PlatformUserRepository platformUserRepository)
        {

            try
            {
                DateTime now = DateTime.UtcNow;
                DateTime reminderStart = reminder.ReminderStart;
                DateTime reminderEnd = reminder.ReminderEnd;
                DateTime remindOn = now;
                long reminderFrequency = 0;

                if (reminder.ReminderFrequency != null)
                {
                    reminderFrequency = (long)reminder.ReminderFrequency;
                }

                //var usr = crmUser.GetBasicProperties(email, session);IsTaskNotificationEnabled ?

                using (var dbContext = new TenantDBContext(reminderMessage.TenantId))
                {
                    using (var _userRepository = new UserRepository(dbContext))
                    {
                        var usr = await _userRepository.GetById((int)reminder.Owner);

                        string email = usr.Email;
                        string subject = reminder.Subject;
                        string deadline = reminderEnd.AddMinutes(reminder.TimeZoneOffset).ToString("dd.MM.yyyy");

                        string userName = string.Format("{0} {1}", usr.FirstName, usr.LastName);

                        var user = await platformUserRepository.Get(usr.Email);

                        /// send notification email.
                        var appUser = new UserItem
                        {
                            AppId = user.AppId,
                            TenantId = user.TenantId.Value,
                            Id = user.Id,
                            UserName = user.Email,
                            Email = user.Email
                        };

                        Email.Notification.Task(userName, subject, email, usr.Culture, deadline,  user.AppId, appUser);
                    };
                }


                while (remindOn <= now && reminderFrequency != 0)
                {
                    /// safety mechanism to prevent reminder message flood to the user.
                    remindOn = remindOn.AddMinutes(reminderFrequency);
                }


                if (reminderFrequency != 0 && (reminderEnd >= remindOn))
                {
                    /// reminders are periodic and the next reminder date is before or at the same time with the deadline.

                    /// update remind_on property for the next time.               
                    reminder.RemindedOn = remindOn;

                    //dynamic result = await cloudantClient.UpdateAsync((string)record._id, record);
                    using (var databaseContext = new TenantDBContext(reminderMessage.TenantId))
                    {
                        using (var _reminderRepository = new ReminderRepository(databaseContext))
                        {

                            var result = await _reminderRepository.Update(reminder);
                            if (result != null)
                            {
                                reminderMessage.Rev = result.Rev;
                                DateTimeOffset dateOffset = DateTime.SpecifyKind(remindOn, DateTimeKind.Utc);
                                Hangfire.BackgroundJob.Schedule<Jobs.Reminder.Activity>(activity => activity.Process(reminderMessage), dateOffset);

                            }

                        }
                    }

                }
            }
            catch (Exception ex)
            {
                ErrorHandler.LogError(ex, $"Reminder Task has failed while running id: {reminderMessage.Id} rev: {reminderMessage.Rev} tenant: {reminderMessage.TenantId}.");
            }
        }
    }
}
