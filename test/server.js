// chorme 不支持 file://文件访问格式  ，用node 起个服务
const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, '../test')))

app.listen(8081, () => {
  console.log(`App listening at port 8081`)
})