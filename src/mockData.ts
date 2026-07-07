import { Hospital } from './types';

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: '北京大学第三医院',
    address: '北京市海淀区花园北路49号',
    distance: '2.5km',
    city: '北京',
    departments: ['骨科', '心内科', '消化内科', '妇产科', '儿科'],
    phone: '010-82266699',
    level: '三甲',
    cooperationType: '门诊/住院'
  },
  {
    id: 'h2',
    name: '北京积水潭医院',
    address: '北京市西城区新街口东街31号',
    distance: '5.1km',
    city: '北京',
    departments: ['骨科', '烧伤科', '内分泌科'],
    phone: '010-58516688',
    level: '三甲',
    cooperationType: '门诊/住院'
  },
  {
    id: 'h3',
    name: '北京协和医院',
    address: '北京市东城区帅府园1号',
    distance: '8.3km',
    city: '北京',
    departments: ['综合内科', '风湿免疫科', '神经内科'],
    phone: '010-69156114',
    level: '三甲',
    cooperationType: '门诊'
  },
  {
    id: 'h4',
    name: '复旦大学附属中山医院',
    address: '上海市徐汇区枫林路180号',
    distance: '1200km',
    city: '上海',
    departments: ['心内科', '肝肿瘤外科'],
    phone: '021-64041990',
    level: '三甲',
    cooperationType: '住院'
  }
];
