import Z3 from 'z3-solver';

export default async function predictNextRandom(sequence: number[] = [
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random()
]): Promise<number | null> {
    sequence = sequence.reverse();

    const { Context } = await Z3.init();
    const z3 = Context('main');
    
    let seState0 = z3.BitVec.const('seState0', 64);
    let seState1 = z3.BitVec.const('seState1', 64);
    
    const solver = new z3.Solver();

    for (let i = 0; i < sequence.length; i++) {
        let seS1 = seState0;
        let seS0 = seState1;
        let nextState0 = seS0;

        seS1 = seS1.xor(seS1.shl(z3.BitVec.val(23n, 64)));
        seS1 = seS1.xor(seS1.lshr(z3.BitVec.val(17n, 64)));
        seS1 = seS1.xor(seS0);
        seS1 = seS1.xor(seS0.lshr(z3.BitVec.val(26n, 64)));
        
        let nextState1 = seS1;

        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setFloat64(0, sequence[i] + 1, true);
        const mantissa = view.getBigUint64(0, true) & ((1n << 52n) - 1n);

        // Compare mantissas
        solver.add(z3.Eq(
            z3.Int2BV(Number(mantissa), 64),
            nextState0.lshr(z3.BitVec.val(12n, 64))
        ));

        seState0 = nextState0;
        seState1 = nextState1;
    }

    const result = await solver.check();
    
    if (result === 'sat') {
        const model = await solver.model();
        const states: Record<string, any> = {};
        
        for (const decl of model.decls()) {
            const value = model.get(decl);
            states[decl.name()] = model.eval(value as any);
        }

        const state0 = BigInt(states.seState0.asString());
        const random = (state0 >> 12n) | 0x3FF0000000000000n;
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setBigUint64(0, random, true);
        const nextNumber = view.getFloat64(0, true) - 1;
        
        return nextNumber;
    }
    
    return null;
}

