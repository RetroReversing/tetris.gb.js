#!/usr/bin/python
# Generater code from opcodes from http://pastraiser.com/cpu/gameboy/gameboy_opcodes.html
# This is based on the original generator from: https://github.com/mmuszkow/gb-disasm by mmuszkow

import re
from HTMLParser import HTMLParser

f = open('./opcodes.html', 'r')
lines = f.read()
f.close()

class MyHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.td = 0
        self.last = []
        self.col = 0
        self.out = []

    def handle_starttag(self, tag, attrs):
        if(tag == 'td'):
            self.td = 1
            self.col += 1
        elif(tag == 'table'):
            self.col = 0

    def handle_endtag(self, tag):
        if(tag == 'td'):
            self.td = 0
            if(self.col > 1):
                self.out.append(self.last)
            self.last = []
        elif(tag == 'tr'):
            self.col = 0

    def handle_data(self, data):
        if(self.td == 1):
            self.last.append(data)

parser = MyHTMLParser()
parser.feed(lines)

# variables
VARS = ['d8', 'd16', 'a8', 'a16', 'r8']
# additional operations for specified functions, bank change emulation
spec = {
    0x3e: '\ta = addr8;',
    0xea: '\tif(mbc != ROM_ONLY && (addr16 == 0x2000 || addr16 == 0x2100)) {\n'
        + '\t\tprintf("Info: Bank switch to %d at 0x%.8X\\n", bank, phy(pc));\n'
        + '\t\tbank = a;\n\t}',
    0xe0: '\thmem[addr8] = a;',
    0xf0: '\ta = hmem[addr8];',
    0x76: '\tprintf("Warning: RGBASM could not handle HALT instruction properly (0x%.8X)\\n", phy(pc));'
}

print '/* AUTOGENERATED - look at generator.py */'
for i in range(0, 0x100):
    op = parser.out[i+0x10]
    if(len(op) == 0): # not used
        continue
    elif(i == 0xCB):
        print '/* bit operations */'
        print 'case 0xcb:'
        print '\tswitch(r->raw[phy(pc+1)]) {'
        for j in range(0, 0x100):
            op2 = parser.out[j+0x120][0]
            print '\t/* %s */' % op2
            print '\tcase ' + hex(j) + ':'
            print '\t\tsops = sops_add(sops, op_0_2("%s"));' % op2
            print '\t\tbreak;'
        print '\t}'
        print '\tpc += 2;'
        print '\tbreak;'
        continue

    print '/* ' + op[0] + ' */' # op[0] = operation description
    print 'case ' + hex(i) + ':'
    if(op[1] == '1'): # 1-byte ops
        name = op[0]
        print '\tsops = sops_add(sops, op_0("%s"));' % name
    elif(op[1] == '2'): # 2-byte ops
        print '\taddr8 = r->raw[phy(pc+1)];'
        for var in VARS:
            bvar = '(' + var + ')'
            if op[0].endswith(var):
                name = op[0][0:len(op[0])-len(var)]
                print '\tsops = sops_add(sops, op_r8("%s", addr8));' % name
                break
            elif op[0].endswith(bvar):
                name = op[0][0:len(op[0])-len(bvar)]
                print '\tsops = sops_add(sops, op_rb8("%s", addr8));' % name
                break
            elif bvar in op[0]:
                where = op[0].find(bvar)
                name = op[0][0:where].strip()
                r = op[0][where+len(bvar):].strip()
                print '\tsops = sops_add(sops, op_lb8("%s", addr8, "%s"));' % (name, r)
                break
            elif var in op[0]:
                where = op[0].find(var)
                name = op[0][0:where].strip()
                r = op[0][where+len(var):].strip()
                print '\tsops = sops_add(sops, op_l8("%s", addr8, "%s"));' % (name, r)
                break
    elif(op[1] == '3'): # 3-byte ops
        print '\taddr16 = r->raw[phy(pc+1)] | (r->raw[phy(pc+2)]<<8);'
        for var in VARS:
            bvar = '(' + var + ')'
            if op[0].endswith(var):
                name = op[0][0:len(op[0])-len(var)]
                print '\tsops = sops_add(sops, op_r16("%s", addr16));' % name
                break
            elif op[0].endswith(bvar):
                name = op[0][0:len(op[0])-len(bvar)]
                print '\tsops = sops_add(sops, op_rb16("%s", addr16));' % name
                break
            elif bvar in op[0]:
                where = op[0].find(bvar)
                name = op[0][0:where].strip()
                r = op[0][where+len(bvar):].strip()
                print '\tsops = sops_add(sops, op_lb16("%s", addr16, "%s"));' % (name, r)
                break
            elif var in op[0]:
                where = op[0].find(var)
                name = op[0][0:where].strip()
                r = op[0][where+len(var):].strip()
                print '\tsops = sops_add(sops, op_l16("%s", addr16, "%s"));' % (name, r)
                break
    else:
        raise Exception('Wrong operator length')

    if i in spec:
        print spec[i]

    # jumps/call handling
    name = name.strip()
    if i == 0xe9: # skip JP (HL)
        print '\tpc += ' + op[1] + ';'
    elif name.startswith('CALL'): # conditional jumps/calls
        print '\taddr_buff_add(&call_addr, phy(addr16));'
        print '\tif(call_follow) jmp16(addr16); else pc += ' + op[1] +';'
    elif name.startswith('JP '):
        print '\taddr_buff_add(&jmp_addr, phy(addr16));'
        print '\tif(jmp_follow) jmp16(addr16); else pc += ' + op[1] +';'
    elif name.startswith('JR '):
        print '\taddr_buff_add(&jmp_addr, phy(rel_addr(addr8)));'
        print '\tif(jmp_follow) jmp8(addr8); else pc += ' + op[1] +';'
    elif name.startswith('JP'): # unconditional jumps
        print '\taddr_buff_add(&jmp_addr, phy(addr16));'
        print '\tif(jmp_follow) jmpu16(addr16); else pc = start;'
    elif name.startswith('JR'):
        print '\taddr_buff_add(&jmp_addr, phy(rel_addr(addr8)));'
        print '\tif(jmp_follow) jmpu8(addr8); else pc = start;'
    elif name.startswith('RET '): # conditional ret
        print '\tpc += 1;'
    elif name.startswith('RET'): # unconditional ret
        print '\tret();'
    else: # skip any other instruction
        print '\tpc += ' + op[1] + ';'
    print '\tbreak;'

print '/* AUTOGENERATED - end */'

