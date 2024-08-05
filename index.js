import express from "express";
import { parse } from "path";
import pg from "pg"

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "to_do_list",
  password: "",
  port: 5432
})

db.connect()

app.get("/", async (req, res) => {
  try{
    const result = await db.query("SELECT * FROM items");
    const items = result.rows;
  
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err){
    console.log(err)
  }
});

app.post("/add", async (req, res) => {
  try{
    const item = req.body.newItem;
    await db.query("INSERT INTO items(title) VALUES ($1)", [item])

  } catch (err){
    console.log(err);
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  try{
    const updatedItemId = parseInt(req.body.updatedItemId);
    const updatedItemTitle = req.body.updatedItemTitle;

    await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItemTitle, updatedItemId]);

  } catch (err){
    console.log(err);
  }
  res.redirect("/")
});

app.post("/delete", (req, res) => {
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
