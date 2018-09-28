'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return createOrgTable(db)
  .then(() => createUsersTable(db))
  .then(() => createProjectsTable(db))
  .then(() => createProjectRelationshipsTable(db))
};

exports.down = function(db) {
  return dropTable(db, 'projectRelationships')
  .then(() => dropTable(db, 'projects'))
  .then(() => dropTable(db, 'users'))
  .then(() => dropTable(db, 'organizations'))
};

function createOrgTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS organizations
      (
        id int NOT NULL PRIMARY KEY auto_increment,
        organizationName varchar(100) NOT NULL,
        dateCreated datetime NOT NULL default NOW(),
        status enum('active','deleted') NOT NULL DEFAULT 'active'
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createUsersTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS users
      (
        id int NOT NULL PRIMARY KEY auto_increment,
        organizationId int NOT NULL,
        email varchar(100) NOT NULL,
        firstName varchar(100) NOT NULL,
        lastName varchar(100) NOT NULL,
        password varchar(64) NOT NULL,
        dateCreated datetime NOT NULL default NOW(),
        role enum('admin','member') NOT NULL DEFAULT 'member',
        status enum('active','deleted') NOT NULL DEFAULT 'active',
        UNIQUE INDEX users_organizationId_email_idx (organizationId, email),
        INDEX users_email_idx (email),
        CONSTRAINT users_organizationId_fk FOREIGN KEY (organizationId)
          REFERENCES organizations(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createProjectsTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS projects
      (
        id int NOT NULL PRIMARY KEY auto_increment,
        organizationId int NOT NULL,
        createdByUserId int NOT NULL,
        projectName varchar(100) NOT NULL,
        dateCreated datetime NOT NULL default NOW(),
        parentProjectId int,
        days smallint unsigned,
        hours smallint unsigned,

        INDEX projects_parentProjectId_idx (parentProjectId),

        CONSTRAINT projects_organizationId_fk FOREIGN KEY (organizationId)
          REFERENCES organizations(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT projects_createdByUserId_fk FOREIGN KEY (createdByUserId)
          REFERENCES users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function createProjectRelationshipsTable(db) {
  return new Promise((resolve, reject) => {
    db.runSql(`CREATE TABLE IF NOT EXISTS projectRelationships
      (
        id int NOT NULL PRIMARY KEY auto_increment,
        projectId int,
        startDate datetime,
        startAfterId int,
        finishWithId int,

        CONSTRAINT projects_projectId_fk FOREIGN KEY (projectId)
          REFERENCES projects(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT projects_startAfterId_fk FOREIGN KEY (startAfterId)
          REFERENCES projects(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT projects_finishWithId_fk FOREIGN KEY (finishWithId)
          REFERENCES projects(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      ) ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
    function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}


function dropTable(db, table) {
  return new Promise((resolve, reject) => {
    db.runSql(`DROP TABLE ${table}`, function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}



exports._meta = {
  "version": 1
};
