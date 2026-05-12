const { app } = require('./app');
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`TodoApp listening on port ${port}`);
})