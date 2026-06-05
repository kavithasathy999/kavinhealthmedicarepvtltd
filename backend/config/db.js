const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const QUERY_TIMEOUT = Number(process.env.DB_QUERY_TIMEOUT || 10000);
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = Number(process.env.DB_PORT || 3306);
const dbSocketPath = process.env.DB_SOCKET_PATH || "";
const dbConfig = {
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kavin_health_medicare_db",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
  queueLimit: 0,
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 30000),
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

if (dbSocketPath) {
  dbConfig.socketPath = dbSocketPath;
} else {
  dbConfig.host = dbHost;
  dbConfig.port = dbPort;
}

console.log(
  `MySQL target: ${dbSocketPath || `${dbHost}:${dbPort}`} / ${dbConfig.database} / ${dbConfig.user}`
);

const db = mysql.createPool(dbConfig);

const originalQuery = db.query.bind(db);

db.query = (sql, values, callback) => {
  const queryOptions =
    typeof sql === "string"
      ? { sql, timeout: QUERY_TIMEOUT }
      : { ...sql, timeout: sql.timeout || QUERY_TIMEOUT };

  if (typeof values === "function") {
    return originalQuery(queryOptions, values);
  }

  return originalQuery(queryOptions, values, callback);
};

const tableDefinitions = {
  admin_profile: `CREATE TABLE IF NOT EXISTS admin_profile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(255)
  )`,
  banners: `CREATE TABLE IF NOT EXISTS banners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tag VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    image VARCHAR(255)
  )`,
  brands: `CREATE TABLE IF NOT EXISTS brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255),
    image_url VARCHAR(255)
  )`,
  blogs: `CREATE TABLE IF NOT EXISTS blogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    blog_date DATE,
    image_url VARCHAR(255),
    read_time VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  testimonials: `CREATE TABLE IF NOT EXISTS testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    designation VARCHAR(255),
    description TEXT,
    star_rating INT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  stats: `CREATE TABLE IF NOT EXISTS stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    value INT,
    label VARCHAR(255),
    suffix VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  contacts: `CREATE TABLE IF NOT EXISTS contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    companyName VARCHAR(255),
    companyEmail VARCHAR(255),
    department VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  career_opportunities: `CREATE TABLE IF NOT EXISTS career_opportunities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    color_from VARCHAR(50),
    color_to VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  career_applications: `CREATE TABLE IF NOT EXISTS career_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    career_id INT,
    fullname VARCHAR(255),
    contact_number VARCHAR(50),
    email VARCHAR(255),
    qualification VARCHAR(255),
    resume_url VARCHAR(255),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (career_id) REFERENCES career_opportunities(id) ON DELETE SET NULL
  )`,
  services: `CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  resource_repository: `CREATE TABLE IF NOT EXISTS resource_repository (
    id INT PRIMARY KEY AUTO_INCREMENT,
    headline VARCHAR(255),
    pdf_url VARCHAR(255),
    file_size VARCHAR(50),
    report_year INT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  page_meta_tags: `CREATE TABLE IF NOT EXISTS page_meta_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_route VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
};

const ensureTables = async () => {
  const connection = await db.promise().getConnection();
  connection.release();
  console.log("MySQL Connected");
  for (const [tableName, query] of Object.entries(tableDefinitions)) {
    try {
      await db.promise().query(query);
    } catch (tableErr) {
      console.error(`Error creating table "${tableName}":`, tableErr.message);
      throw tableErr;
    }
  }
};

db.ensureTables = ensureTables;

db.ready = ensureTables().catch((err) => {
  console.error("Database initialization failed:", err.message);
  throw err;
});

module.exports = db;
