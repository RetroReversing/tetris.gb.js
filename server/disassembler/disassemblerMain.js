const { Map, List, Seq } = require('immutable')
const _ = require('lodash');

const one_byte_instructions = {
    0x00: 'NOP',
    0x0c: 'INC C'
}

const two_byte_instructions = {
    0x18: 'JR'
}

const three_byte_instructions = {
    0xC3: 'JP'
}

function handleTwoByteInstructions(byteValue, operandByte) {
    const instruction = two_byte_instructions[byteValue];
    const operand = convertToHex(operandByte);
    return instruction+' '+operand;
}

function handleThreeByteInstructions(byteValue, operandByte1, operandByte2) {
    const instruction = three_byte_instructions[byteValue];
    const operand = convertToHex(operandByte2)+convertToHex(operandByte1,'');
    return instruction+' '+operand;
}

function disassembleByte(byteValue,key,byteArray) {
    const opcode = byteValue[0];
    if (one_byte_instructions[opcode])
         return one_byte_instructions[opcode];
    const operand = byteValue[1];
    if (two_byte_instructions[opcode])
    {
        return handleTwoByteInstructions(opcode, operand );
    }
    if (three_byte_instructions[opcode])
    {
        return handleThreeByteInstructions(opcode, operand, byteValue[2]);
    }

}

function getNumberOfBytesForInstruction(opcode) {
    if (one_byte_instructions[opcode])
         return 1;
    if (two_byte_instructions[opcode])
        return 2;
    if (three_byte_instructions[opcode])
        return 3;
    return 0;
}

function skipBytesAndAddOperandsToLastInstruction(assemblyInstructions, operandValue) {
    const lastInstructionEntryIndex = assemblyInstructions.instructions.length -1;
    assemblyInstructions.instructions[lastInstructionEntryIndex].push(operandValue);
    assemblyInstructions.skipBytes-=1;
    return assemblyInstructions;
}

function handleOpcode(value,assemblyInstructions) {
    assemblyInstructions.instructions.push([value]);
    assemblyInstructions.skipBytes = getNumberOfBytesForInstruction(value) -1;
    return assemblyInstructions;
}

export function joinOpcodesAndOperands(assemblyInstructions,value,index,collection) {
    if (assemblyInstructions.skipBytes === 0)
        {
            return handleOpcode(value, assemblyInstructions);
        }
    return skipBytesAndAddOperandsToLastInstruction(assemblyInstructions,value);
}

function reduceBytesToDisassembleIntoInstructionGroups(bytesToDisassemble) {
    return _.reduce(bytesToDisassemble,joinOpcodesAndOperands,{instructions:[],skipBytes:0}).instructions;
}

export function DisassembleBytes(bytesToDisassemble) {
    const instructions = reduceBytesToDisassembleIntoInstructionGroups(bytesToDisassemble);
    return Seq(instructions)
           .map(disassembleByte)
           .filter(assemblyCode => assemblyCode !== '')
           .toArray();
}

export function convertToHex(value, prefix='$') {
    return prefix+ ((value).toString(16)).toUpperCase();
}