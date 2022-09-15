const fs=require('fs');
const http = require('http');
const url = require('url');

const slugify=require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');


/////////////////////////////////
// FILES

// Blocking, synchronous way
// const textIn=fs.readFileSync('starter/txt/input.txt','utf-8');
// console.log(textIn);

// const textOut = `Haha lol ${textIn}. Created on ${Date.now()}`;
// fs.writeFileSync('starter/txt/output.txt',textOut);
// console.log('File written!');

// NOTE: If passing a relative filepath to readFile(),
// fs.readFile() reads file paths RELATIVE TO THE CURRENT WORKING DIRECTORY

// Non-blocking, asynchronous way

// fs.readFile('starter/txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`starter/txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         fs.readFile(`starter/txt/append.txt`,'utf-8',(err,data3)=>{
//             let data=`${data2}\n${data3}`;
//             fs.writeFile('starter/txt/output.txt',data,(err)=>{
//                 console.log('Your file has been written.')
//             });
//         })
//     })
// })

// console.log('Will read file!');

/////////////////////////////////
// SERVER

// 11.Creting simple web server

// const server=http.createServer((req,res)=>{
//     // console.log(req);
//     // console.log('Hisham');
//     console.log(req.url)
//     res.end(`Hello from the server!`)
// });
// server.listen(8000,'127.0.0.1',()=>{console.log('Listening to requests on port 8000')})

//12.Routing

// const server=http.createServer((req,res)=>{

//     const pathname=req.url;
//     // res.end(`Hello from the server!`)

//     if (pathname === '/' || pathname === '/overview') {
//         res.end('This is the overview!')

//       } else if (pathname === '/product') {
//         res.end('This is the product!');
//       }    // Not found
//        else {
//         res.writeHead(404, {
//           'Content-type': 'text/html',
//           'my-own-header': 'hello-world' //custom header
//         });
//         res.end('<h1>Page not found!</h1>');
//       }
// });
// server.listen(8000,'127.0.0.1',()=>{console.log('Listening to requests on port 8000')})

//13. Building a (Very) Simple API

// https://heynode.com/tutorial/readwrite-json-files-nodejs/#:~:text=To%20load%20the%20data%20from,be%20passed%20to%20the%20callback.

//Q: https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080930#questions/7756862

// console.log(fs.readFileSync('1-node-farm/starter/txt/input.txt','utf-8'))
// console.log(fs.readFileSync('./1-node-farm/starter/txt/input.txt','utf-8'))
// console.log(fs.readFileSync(`${__dirname}/txt/input.txt`,'utf-8'))
// dirname= returns the current directory in which the script is running

// console.log(__dirname); 

// const data=fs.readFileSync('./starter/dev-data/data.json','utf-8')
//OR
// const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
// const productData = JSON.parse(data);

// const server=http.createServer((req,res)=>{
   
//     const pathname=req.url;
//     // res.end(`Hello from the server!`)

//     if (pathname === '/' || pathname === '/overview') {
//       res.writeHead(200,{'Content-type':'text/html'})
//         res.end(tempOverview)

//       } else if (pathname === '/product') {
//         res.end('This is the product!');
//       }    // Not found
//       else if (pathname === '/api') {
//         // fs.readFile('./starter/dev-data/data.json','utf-8',(err,data)=>{
//         //    const productData = JSON.parse(data);
//         //    console.log(typeof(data));
//         //    console.log(productData);
//            res.writeHead(200, {'Content-type': 'application/json'});
//            res.end(data); //DOUBT: DATA IS STRING HERE THEN WHY SET CONTENT TYPE TO JSON?
//         // })
//       } 
//        else {
//         res.writeHead(404, {
//           'Content-type': 'text/html',
//           'my-own-header': 'hello-world' //custom header
//         });
//         res.end('<h1>Page not found!</h1>');
//       }
// });
// server.listen(8000,'127.0.0.1',()=>{console.log('Listening to requests on port 8000')})

//14 onwards HTML Templating: Building the Templates

//VERY GOOD SLUG SOLUTION:

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const productData = JSON.parse(data);
const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')

const slugs=productData.map(el=>el.slug = slugify(el.productName,{lower:true}))
// console.log(productData);
// https://www.npmjs.com/package/slugify

const server=http.createServer((req,res)=>{
   
    // const pathname=req.url;

  console.log(url.parse(req.url)); 
  //https://www.geeksforgeeks.org/node-js-url-parseurlstring-parsequerystring-slashesdenotehost-api/

  // console.log(url.parse(req.url, true));
    const { query, pathname } = url.parse(req.url, true);
    // console.log(pathname, query);

    if (pathname === '/' || pathname === '/overview') {
      res.writeHead(200,{'Content-type':'text/html'})
      let cardsHtml=productData.map(el => replaceTemplate(tempCard,el)).join(' ');
      const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);     
      res.end(output)

      } else if (pathname.includes('/product')) {
        // const temp=query.slug;
        // console.log(temp,result);
        const slug = pathname.substring(pathname.lastIndexOf('/')+1)
        const result=productData.find(el => el.slug == slug)
        console.log(slug,result);
        const ans=replaceTemplate(tempProduct,result)
        res.writeHead(200,{'Content-type':'text/html'})
        res.end(ans);
      }    // Not found
      else if (pathname === '/api') {
        // fs.readFile('./starter/dev-data/data.json','utf-8',(err,data)=>{
        //    const productData = JSON.parse(data);
        //    console.log(typeof(data));
        //    console.log(productData);
           res.writeHead(200, {'Content-type': 'application/json'});
           res.end(data); //DOUBT: DATA IS STRING HERE THEN WHY SET CONTENT TYPE TO JSON?
        // })
      } 
       else {
        res.writeHead(404, {
          'Content-type': 'text/html',
          'my-own-header': 'hello-world' //custom header
        });
        res.end('<h1>Page not found!</h1>');
      }
});
server.listen(8000,'127.0.0.1',()=>{console.log('Listening to requests on port 8000')})

//VVI 21. Package Versioning and Updating