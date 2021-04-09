# Bild

A REST API static content hosting platform.

Bild was born from a problem I was encountering while creating SPAs with NextJS. I couldn't dynamically add images to
the images folder. So I had no place to store my images, and globally, all my static content. From there came the idea
to create my own static content storage system. Configured according to my needs, and potentially those of other
developers who were facing the same problem as me.

<a href="./LICENSE" alt="License">
  <img src="https://img.shields.io/badge/License-Apache-green" />
</a>
<a href="https://github.com/mlbonniec/bild/commit/master" alt="Commits">
  <img src="https://img.shields.io/github/commit-activity/m/mlbonniec/bild" />
</a>
<a href="https://github.com/mlbonniec/bild/commit/master" alt="Last commit">
  <img src="https://img.shields.io/github/last-commit/mlbonniec/bild/master" />
</a>
<a href="https://github.com/mlbonniec/bild/graphs/contributors" alt="Contributors">
  <img src="https://img.shields.io/github/contributors/mlbonniec/bild" />
</a>
<a href="https://github.com/mlbonniec/bild/issues" alt="Issues">
  <img src="https://img.shields.io/github/issues-raw/mlbonniec/bild" />
</a>
<a href="https://github.com/mlbonniec/bild" alt="Github stars">
  <img src="https://img.shields.io/github/stars/mlbonniec/bild?style=social" />
</a>

## Table of contents

- [Bild](#bild)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)

## Installation

To install Bild, clone the Github repository and install the node modules. Then create a `.env` file.

```bash
$ git clone https://github.com/mlbonniec/bild.git
$ cd bild
$ npm install
$ cp .env.example .env
```

You can then fill in your personnal information in the `.env` file.

When this is done, launch Postgres with docker-compose. This will also launch pgadmin on `localhost:8080`.

```bash
$ docker-compose up
```

Finally, create the database and generate the schemas with MikroORM:

```bash
$ npx mikro-orm schema:create --run
```

## Usage

You can launch Bild either in development mode or in production mode. Server will be launched on `localhost:5000`,
unless you add `PORT=your port` in the your environment variables.
You must use Node.js v10.17+, v12+, v14+, but not v15 (or odd-numbered versions in general).

**Development**

You can use the `start:dev` (or `dev`) script to launch the app. It will automatically recompile whenever you save a file.
```bash
$ npm run start:dev # or npm run dev
```

**Production**

``` bash
$ npm run start
```

**Test**

```bash
$ npm run lint # Run linting tests (append ":fix" to automatically fix most of the errors)
$ npm run test # Run unit tests (append ":watch" to automatically restrat them when a file is saved)
$ npm run test:e2e # Run end-to-end tests
$ npm run test:cov # Run coverage tests
$ npm run test:all # Run all tests, except coverage
```

## License

Copyright © 2021 Mathis Le Bonniec & Elliot Maisl. Licensed under the Apache-2.0 license, see [the license](./LICENSE).
