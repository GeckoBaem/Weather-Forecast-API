// const nextConfig = {
//     async headers() {
//         return [
//             {
//                 // Apply headers to all routes
//                 source: '/(.*)',
//                 headers: [
//                     {
//                         key: 'Access-Control-Allow-Credentials',
//                         value: 'true',
//                     },
//                     {
//                         key: 'Access-Control-Allow-Origin',
//                         // Replace with your domain
//                         value: '*',
//                     },
//                     {
//                         key: 'Access-Control-Allow-Methods',
//                         value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
//                     },
//                     {
//                         key: 'Access-Control-Allow-Headers',
//                         value: 'X-CSRF-Token, X-Requested-With, Accept, Accept- Version, Content - Length, Content - MD5, Content - Type, Date, X - Api - Version',
//                     },
//                 ],
//             },
//         ];
//     },
// };

// module.exports = nextConfig;


// export default {
//     async headers() {
//         return [
//             {
//                 // Apply headers to all routes
//                 source: '/(.*)',
//                 headers: [
//                     {
//                         key: 'Access-Control-Allow-Credentials',
//                         value: 'true',
//                     },
//                     {
//                         key: 'Access-Control-Allow-Origin',
//                         // Replace with your domain
//                         value: '*',
//                     },
//                     {
//                         key: 'Access-Control-Allow-Methods',
//                         value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
//                     },
//                     {
//                         key: 'Access-Control-Allow-Headers',
//                         value: 'X-CSRF-Token, X-Requested-With, Accept, Accept- Version, Content - Length, Content - MD5, Content - Type, Date, X - Api - Version',
//                     },
//                 ],
//             },
//         ];
//     },
// };

// const allowCors = fn => async (req, res) => {
//     res.setHeader('Access-Control-Allow-Credentials', true)
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     // another common pattern
//     // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//     res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//     )
//     if (req.method === 'OPTIONS') {
//         res.status(200).end()
//         return
//     }
//     return await fn(req, res)
// }

// const handler = (req, res) => {
//     const d = new Date()
//     res.end(d.toString())
// }

// export allowCors(handler)