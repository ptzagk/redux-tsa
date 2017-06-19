// simulates a network request that performs a background check
export function backgroundCheck(name) {
    const blackList = ["apple"];
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(!blackList.includes(name));
        }, 100);
    });
}
