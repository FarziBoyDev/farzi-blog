import express from "express";
const port = 3000;
const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as templating engine
app.set("view engine", "ejs");

// Store posts in memory (for simplicity)
let posts = [];


app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.post("/home",(req,res)=>{
    res.redirect("/");
})

app.get("/linelink", (req, res) => {
    res.render("linelink.ejs");
});
  
app.get("/websites", (req, res) => {
    res.render("websites.ejs");
});

app.get("/blog", (req, res) => {
    res.render("blog.ejs", { posts: posts });
});

app.get("/create",(req,res)=>{
    res.render("create.ejs");
})

// Handle new post submission
app.get("/blog", async (req, res) => {
    const snapshot = await db.collection("posts").orderBy("date", "desc").get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.render("blog", { posts });
  });
  
  // Create post
  app.post("/makePost", async (req, res) => {
    const { title, author, postBody } = req.body;
    if (title && author && postBody) {
      await db.collection("posts").add({ title, author, postBody, date: new Date() });
    }
    res.redirect("/blog");
  });
  
  // Delete post
  app.post("/deletePost", async (req, res) => {
    const id = req.body.id;
    await db.collection("posts").doc(id).delete();
    res.redirect("/blog");
  });
  
  // Edit post page
  app.get("/editPost", async (req, res) => {
    const id = req.query.id;
    const doc = await db.collection("posts").doc(id).get();
    if (doc.exists) res.render("edit", { post: doc.data(), id });
    else res.redirect("/blog");
  });
  
  // Update post
  app.post("/editPost", async (req, res) => {
    const { id, title, author, postBody } = req.body;
    await db.collection("posts").doc(id).update({ title, author, postBody, date: new Date() });
    res.redirect("/blog");
  });
  



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });