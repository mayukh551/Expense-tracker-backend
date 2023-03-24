const Sequencer = require('@jest/test-sequencer').default;

// importing tests config
const { testsOrder } = require('../config/testConfig');


class CustomSequencer extends Sequencer {
    constructor() {
        super();
        this.testsOrder = testsOrder;
    }

    /**
     * Sort test to determine order of execution
     * Sorting is applied after sharding
     */
    sort(tests) {
        // Test structure information
        const copyTests = Array.from(tests);
        const finalTestsOrder = [];

        for (const test of testsOrder) {
            for (const copyTest of copyTests) {
                const index = copyTest.path.indexOf(target);
                if (copyTest.path.slice(index) === test)
                    finalTestsOrder.push(copyTest);
            }
        }


        // console.log(finalTestsOrder);
        return finalTestsOrder;
    }
}

module.exports = CustomSequencer;