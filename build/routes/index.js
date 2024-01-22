import * as fs from "fs";
let files = fs.readdirSync(__dirname);
console.log(files);
files = files.filter((f) => f.indexOf(".routes.") > -1);
export default async function (fastify, opts, done) {
    files.map((f, i) => {
        import(__dirname + "/" + f).then((routes) => {
            console.log(routes);
            routes.default.map((r) => {
                fastify.route(r);
                if (i === files.length - 1)
                    done();
            });
        });
    });
}
//# sourceMappingURL=index.js.map