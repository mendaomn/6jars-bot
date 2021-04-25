import { earn, spend } from ".."
import { Jar, JarName } from "../../../types";

describe('given a spend handler and the current jars', () => {
    let subject = spend;
    let mockJars: Jar[] = [{
        id: 'nec-id',
        amount: 100,
        name: 'NEC',
        percentage: 0.15,
    }, {
        id: 'ply-id',
        amount: 50,
        name: 'PLY',
        percentage: 0.15,
    }];

    describe('when user spends money from a specific jar', () => {
        let amount = 20;
        let targetJar: JarName = 'NEC';

        it('should subtract that money from that jar', () => {
            const outputJars = subject(mockJars, targetJar, amount)
            const expectedJars = [
                {...mockJars[0], amount: 80},
                mockJars[1],
            ]

            expect(outputJars).toEqual(expectedJars)
        })
    })
})

describe('given an earn handler and the current jars', () => {
    let subject = earn;
    let mockJars: Jar[] = [{
        id: 'nec-id',
        amount: 100,
        name: 'NEC',
        percentage: 0.15,
    }, {
        id: 'ply-id',
        amount: 50,
        name: 'PLY',
        percentage: 0.15,
    }];

    describe('when user earns money', () => {
        let amount = 1000;

        it('should spread that money according to each jar\'s percentage', () => {
            const outputJars = subject(mockJars, amount)
            const expectedJars = [
                {...mockJars[0], amount: 250},
                {...mockJars[1], amount: 200},
            ]

            expect(outputJars).toEqual(expectedJars)
        })
    })
})