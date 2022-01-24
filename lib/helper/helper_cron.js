const { CronJob, time } = require('cron');
class cronMgr {
    constructor() {
        this.timeZone = 'Asia/Shanghai';//https://www.zeitverschiebung.net/en/timezone/asia--shanghai //时区
        this.job = new Map()
    }

    //秒 分 时 日 月 星期几（0-6）
    createJob(name, cronTime, funct) {
        this.job.set(name, new CronJob(cronTime, funct, null, true, this.timeZone));
        this.job.get(name).start();
    }

    updateJob(name, cronTime) {
        if (this.job.has(name)) {
            let job = this.job.get(name)
            job.setTime(time(cronTime, this.timeZone));
            job.start()
        } else {
            throw ('no job->' + name)
        }
    }

    delJob(name) {
        if (this.job.has(name)) {
            let job = this.job.get(name)
            job.stop()
            this.job.delete(name);
            job = null;
        } else {
            throw ('no job->' + name)
        }
    }

    nextAllRunTime() {
        let timeList = {}
        for (let name of this.job.keys()) {
            timeList[name] = this.nextRunTime(name);
        }
        return timeList;
    }

    nextRunTime(name) {
        if (this.job.has(name)) {
            let job = this.job.get(name)
            // console.log(job.nextDates().format('HHmm')) 
            return job.nextDates().format('YYYY-MM-DD HH:mm:ss')
        } else {
            throw ('no job->' + name)
        }
    }
}

module.exports = cronMgr