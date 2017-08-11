import {DisassembleBytes, convertToHex, joinOpcodesAndOperands} from './disassemblerMain';
import * as assert from 'assert';

describe('Disasemble Rom', function() {

    it('should generate assembly output for single INC C', function(done) {
        const resultingAssembly = DisassembleBytes([0x0C]);
        assert.equal(resultingAssembly[0],"INC C");
        done();
    })

    it('should generate assembly output for NOP', function() {
        const resultingAssembly = DisassembleBytes([0x00]);
        assert.equal(resultingAssembly[0], 'NOP')
    })

    it('should support 2-byte jump return instructions', function() {
        const resultingAssembly = DisassembleBytes([0x18, 0xBE]);
        assert.equal(resultingAssembly[0], 'JR $BE')
    })
    it('should support 2-byte jump return instructions with $AE', function() {
        const resultingAssembly = DisassembleBytes([0x18, 0xAE]);
        assert.equal(resultingAssembly[0], 'JR $AE')
    })

    it('should support 3-byte jump instructions', function() {
        const resultingAssembly = DisassembleBytes([0xC3, 0xD3, 0x64]);
        assert.equal(resultingAssembly[0], 'JP $64D3')
    })

    it('should support 3-byte jump instructions to location $69A5', function() {
        const resultingAssembly = DisassembleBytes([0xC3, 0xA5, 0x69]);
        assert.equal(resultingAssembly[0], 'JP $69A5')
    })

    it('should support 2-byte jump return instruction followed by a NOP', function() {
        const resultingAssembly = DisassembleBytes([0x18, 0xAE, 0x00]);
        assert.deepEqual(resultingAssembly, ['JR $AE','NOP'])
    })

    it('should convert 174 to hex value $AE', function() {
        const hexResult = convertToHex(174);
        assert.equal(hexResult, '$AE');
    })

    it('should be able to join opcodes and operands into one array', function() {
        const instructionResult = joinOpcodesAndOperands({instructions:[],skipBytes:0},0x18,0,[]);
        assert.deepEqual(instructionResult, { instructions: [ [24] ], skipBytes: 1 });
    })
});