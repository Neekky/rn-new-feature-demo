import Mock from 'mockjs';

const Random = Mock.Random;

Random.csentence;

const data = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  'data|50': [
    {
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1,
      title: '@csentence',
    },
  ],
});

export default data;
