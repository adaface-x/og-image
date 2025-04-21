let queues = {};

async function queueFunction(queueName, func, max_concurrent = 1) {
    if (!queues[queueName]) {
        queues[queueName] = {
            queue: [],
            running: 0,
            max_concurrent,
        };
    }

    return new Promise(async (resolve, reject) => {
        queues[queueName].queue.push({
            func,
            resolve,
            reject,
        });

        console.log(
            `Added to queue ${queueName} || Pending: ${queues[queueName].queue.length} || Running: ${queues[queueName].running}`
        );
        await processQueue(queueName);
    });
}

async function processQueue(queueName) {
    if (
        queues[queueName].queue.length === 0 ||
        queues[queueName].running >= queues[queueName].max_concurrent
    ) {
        return;
    }

    queues[queueName].running += 1;

    const { func, resolve, reject } = queues[queueName].queue.shift();

    try {
        const result = await func();
        resolve(result);
    } catch (e) {
        console.log("Error in running function", e);
        reject(e);
    }

    console.log(
        "Clearing a job in queue: ",
        queueName,
        " ||| Pending: ",
        queues[queueName].queue.length,
        " ||| Running: ",
        queues[queueName].running
    );

    queues[queueName].running -= 1;
    await processQueue(queueName);
}

module.exports = {
    queueFunction,
};
