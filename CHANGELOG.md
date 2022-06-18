## [1.9.1](https://github.com/Greenstand/treetracker-field-data/compare/v1.9.0...v1.9.1) (2022-06-18)


### Bug Fixes

* add created_at column on wallet registration ([d613e0a](https://github.com/Greenstand/treetracker-field-data/commit/d613e0aee3f50e6b8d257974093607c3cbdff0dc))

# [1.9.0](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.30...v1.9.0) (2022-06-09)


### Bug Fixes

* lint ([3f5a6dc](https://github.com/Greenstand/treetracker-field-data/commit/3f5a6dc56f18aac756ea908ba5fe9c3b52ce0a74))
* package-lock ([3b16c4b](https://github.com/Greenstand/treetracker-field-data/commit/3b16c4b863a22687626d55b9960e84de679cd523))


### Features

* pass along the organization_id in session and raw-capture data ([94fc2d5](https://github.com/Greenstand/treetracker-field-data/commit/94fc2d592da98bd1fa229db35917b5edd04f0cb0))

## [1.8.30](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.29...v1.8.30) (2022-06-07)


### Bug Fixes

* package lock ([24827a0](https://github.com/Greenstand/treetracker-field-data/commit/24827a0dcf583e665efb2c4e2f4a6412190a1db8))
* resolve linter errors ([0045a87](https://github.com/Greenstand/treetracker-field-data/commit/0045a874c6b8348555de59e43e12ce458717e2c5))
* resolve package dependency issues ([36489ce](https://github.com/Greenstand/treetracker-field-data/commit/36489ce5f8c9404a734fcd4ad474d4fbc5300cb0))

## [1.8.29](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.28...v1.8.29) (2022-06-07)


### Bug Fixes

* fix legacy tree creation ([6d73eed](https://github.com/Greenstand/treetracker-field-data/commit/6d73eed408c7bc8df572eb1fcf02f82015fb39a0))
* legacy tree uuid picking session id instead of capture id ([a7d6c04](https://github.com/Greenstand/treetracker-field-data/commit/a7d6c048547f7e5a6d62de8dfdc682ced80c525f))
* remove session id from legacy tree ([db5e07f](https://github.com/Greenstand/treetracker-field-data/commit/db5e07fea32fe60e79549ba18e9ca2e2036955bf))
* session id ([261c804](https://github.com/Greenstand/treetracker-field-data/commit/261c804882bd40257db4dcc8091095cfd437895c))

## [1.8.28](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.27...v1.8.28) (2022-06-02)


### Bug Fixes

* add migration update for gps_accuracy ([05a4f5b](https://github.com/Greenstand/treetracker-field-data/commit/05a4f5bef0968e4b41a037697cb6bcf379badf7b))
* change error logging type ([457b53a](https://github.com/Greenstand/treetracker-field-data/commit/457b53a3c6643b5b07a197f3e1242ac5943dabb1))
* gps_accuracy allow decimal values ([fc40961](https://github.com/Greenstand/treetracker-field-data/commit/fc40961fa32e31a320ba1856181574f0ad382bf2))

## [1.8.27](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.26...v1.8.27) (2022-05-17)


### Bug Fixes

* update db url check ([56264aa](https://github.com/Greenstand/treetracker-field-data/commit/56264aa9a4dc5cd93aca01bcd43128a42a07aacf))

## [1.8.26](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.25...v1.8.26) (2022-05-03)


### Bug Fixes

* add bulk pack file name ([eb892db](https://github.com/Greenstand/treetracker-field-data/commit/eb892db7f7f4e6b17ded93b968fa2b7c0f4a3c28))
* add events test ([05a6fac](https://github.com/Greenstand/treetracker-field-data/commit/05a6fac42c95576d8cd0166f18ae3dc23507b7af))
* merge conflict ([85257c0](https://github.com/Greenstand/treetracker-field-data/commit/85257c0dfa6bd92ca4d4e37a422c6f2b04ea27f9))
* refactoring ([42a05b1](https://github.com/Greenstand/treetracker-field-data/commit/42a05b181addb0d75bd0e349ceb8ab2aade1dd9b))

## [1.8.25](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.24...v1.8.25) (2022-03-24)


### Bug Fixes

* add organization id to session column, following https://github.com/Greenstand/treetracker-field-data/blob/main/docs/adr/0001-organization-by-session-bridge.md ([df400fa](https://github.com/Greenstand/treetracker-field-data/commit/df400fa727d35daaaf7867a854382ada23e199ed))

## [1.8.24](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.23...v1.8.24) (2022-03-17)


### Bug Fixes

* allow pseudoemails ([b121965](https://github.com/Greenstand/treetracker-field-data/commit/b121965db81a769b9bc0c5ce5cf6ff571144991e))
* linting ([f0ea12b](https://github.com/Greenstand/treetracker-field-data/commit/f0ea12b61eaed84cedfecdac6b564bc4b60a7751))

## [1.8.23](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.22...v1.8.23) (2022-03-08)


### Bug Fixes

* correct typo ([70f79d6](https://github.com/Greenstand/treetracker-field-data/commit/70f79d69864e4e7f4075546fcd01a94e85bc005d))
* handle existing legacy db trees but new captures ([c99d80f](https://github.com/Greenstand/treetracker-field-data/commit/c99d80ffc14451603d3e6972953a58ba4e38b603))
* minor bug ([34f3ce3](https://github.com/Greenstand/treetracker-field-data/commit/34f3ce30347cb46c49f6601b0761f8740ad27f6d))
* rotation matrix unsafe number ([04713e6](https://github.com/Greenstand/treetracker-field-data/commit/04713e6b56a8296980bb56489463d74b5a3364a6))

## [1.8.22](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.21...v1.8.22) (2022-03-08)


### Bug Fixes

* force deployment ([31af392](https://github.com/Greenstand/treetracker-field-data/commit/31af392df0073dfd95d7c5d7ee52a979c8ef4178))

## [1.8.21](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.20...v1.8.21) (2022-03-06)


### Bug Fixes

* set up sealed secrets for production ([c081a03](https://github.com/Greenstand/treetracker-field-data/commit/c081a03752957a217ff48dfb20a3dbd03278df08))

## [1.8.20](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.19...v1.8.20) (2022-03-06)


### Bug Fixes

* update secrets for test env ([3bc3867](https://github.com/Greenstand/treetracker-field-data/commit/3bc3867861a5a27e4d491daa8e12534dd49e4c97))

## [1.8.19](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.18...v1.8.19) (2022-03-06)


### Bug Fixes

* add correct affinity for databasem migration pod ([eb01b61](https://github.com/Greenstand/treetracker-field-data/commit/eb01b618ec82f40fd413577fe7aa2fe3fde94023))

## [1.8.18](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.17...v1.8.18) (2022-03-06)


### Bug Fixes

* change rotation_matrix datatype to float[] ([c18a3bd](https://github.com/Greenstand/treetracker-field-data/commit/c18a3bd22fb5142b3028fdb8aa434244ec5c4070))

## [1.8.17](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.16...v1.8.17) (2022-03-02)


### Bug Fixes

* update migration secret ([5fe3d0e](https://github.com/Greenstand/treetracker-field-data/commit/5fe3d0e0c2a28c9ae8a27d3610111fff2ff11d9a))

## [1.8.16](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.15...v1.8.16) (2022-03-02)


### Bug Fixes

* allow session organization accept empty values ([ccc8f7d](https://github.com/Greenstand/treetracker-field-data/commit/ccc8f7d1226ec9ea698e6a9df18a2f37450852cd))

## [1.8.15](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.14...v1.8.15) (2022-03-02)


### Bug Fixes

* allow empty string for v1 org ([1d6f5be](https://github.com/Greenstand/treetracker-field-data/commit/1d6f5bee3393ca9633133c64db4e287de39923eb))

## [1.8.14](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.13...v1.8.14) (2022-03-01)


### Bug Fixes

* allow empty values for devie_configuration serial field ([72a2989](https://github.com/Greenstand/treetracker-field-data/commit/72a2989b9bcfd367db7c665d23c239921237b451))

## [1.8.13](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.12...v1.8.13) (2022-03-01)


### Bug Fixes

* update migration test env ([4314de8](https://github.com/Greenstand/treetracker-field-data/commit/4314de8a7fca9c899634a76182718d7e39c01d4a))

## [1.8.12](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.11...v1.8.12) (2022-03-01)


### Bug Fixes

* update migration dev env ([d987aee](https://github.com/Greenstand/treetracker-field-data/commit/d987aeeead18268fac05083598b562d2151a5dc3))

## [1.8.11](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.10...v1.8.11) (2022-03-01)


### Bug Fixes

* update migration dev env ([b6a3052](https://github.com/Greenstand/treetracker-field-data/commit/b6a30527789f194634546590a804a2db8d65b7fd))

## [1.8.10](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.9...v1.8.10) (2022-03-01)


### Bug Fixes

* update migration dev env ([fba54b5](https://github.com/Greenstand/treetracker-field-data/commit/fba54b57f4601e0e62ea07c93ca0786ce52f9fff))

## [1.8.9](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.8...v1.8.9) (2022-03-01)


### Bug Fixes

* add file to kustomization base ([195c115](https://github.com/Greenstand/treetracker-field-data/commit/195c11577e460242b3196d1bcd7658219f7c938f))

## [1.8.8](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.7...v1.8.8) (2022-03-01)


### Bug Fixes

* add missing base file ([2a63cc4](https://github.com/Greenstand/treetracker-field-data/commit/2a63cc4dbc8b61c37e664bc3cdace37b58dd6106))
* return valid error if session has not been created yet for raw capture insert ([a7429fe](https://github.com/Greenstand/treetracker-field-data/commit/a7429fed0f2391ce7a705953ae5dfa282fc4c494))

## [1.8.7](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.6...v1.8.7) (2022-03-01)


### Bug Fixes

* add sealed secrets ([a477c78](https://github.com/Greenstand/treetracker-field-data/commit/a477c7823fc9bd2223e1232d695ca8d7df9aaa9a))

## [1.8.6](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.5...v1.8.6) (2022-03-01)


### Bug Fixes

* update migration test env ([19681cb](https://github.com/Greenstand/treetracker-field-data/commit/19681cb0e42110435b264a8e92bbf4b3f4668a50))

## [1.8.5](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.4...v1.8.5) (2022-03-01)


### Bug Fixes

* linting ([a58aebd](https://github.com/Greenstand/treetracker-field-data/commit/a58aebd8a0e38a084d6e57ce46058b0dad90ebc6))

## [1.8.4](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.3...v1.8.4) (2022-03-01)


### Bug Fixes

* update migration dev env ([d8aa152](https://github.com/Greenstand/treetracker-field-data/commit/d8aa1521bc8013d4a686caf4274a1edf752faf90))

## [1.8.3](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.2...v1.8.3) (2022-03-01)


### Bug Fixes

* updated files ([6007e44](https://github.com/Greenstand/treetracker-field-data/commit/6007e441900fcfe593484f91bd49a3295fc3c8a0))

## [1.8.2](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.1...v1.8.2) (2022-02-27)


### Bug Fixes

* skip validation on extra_attributes for now, field not processed ([4b75a2c](https://github.com/Greenstand/treetracker-field-data/commit/4b75a2c28dff136bfd24830e9c2a8043870ad778))

## [1.8.1](https://github.com/Greenstand/treetracker-field-data/compare/v1.8.0...v1.8.1) (2022-02-27)


### Bug Fixes

* skip validation on extra_attributes for now, field not processed ([e9d57a3](https://github.com/Greenstand/treetracker-field-data/commit/e9d57a3e86dbac492beed4524501991b7ae040c3))

# [1.8.0](https://github.com/Greenstand/treetracker-field-data/compare/v1.7.1...v1.8.0) (2022-02-27)


### Features

* change capture_taken_at to captured_at ([2ada720](https://github.com/Greenstand/treetracker-field-data/commit/2ada72090306d55a322f3dd177f76ff1196421ae))

## [1.7.1](https://github.com/Greenstand/treetracker-field-data/compare/v1.7.0...v1.7.1) (2022-02-26)


### Bug Fixes

* allow nulls for advanced properties ([a807562](https://github.com/Greenstand/treetracker-field-data/commit/a80756237ae1f6d275abd62c0a1ce727822a0cfc))
* skip extra_attributes until implemented on mobile side ([b847a49](https://github.com/Greenstand/treetracker-field-data/commit/b847a4937d6fb8cf30e5fbff10642dddb1d0097c))

# [1.7.0](https://github.com/Greenstand/treetracker-field-data/compare/v1.6.1...v1.7.0) (2022-02-19)


### Bug Fixes

* add tests and other endpoint updates ([6a5f4cd](https://github.com/Greenstand/treetracker-field-data/commit/6a5f4cdce1cee4194c42a55cdd30bb72b08ec191))


### Features

* add bulk-pack v2 endpoints ([ae429f1](https://github.com/Greenstand/treetracker-field-data/commit/ae429f1acd6d73777793458035a6004a0e96d050))
* add rawCapture single endpoint ([5d06aad](https://github.com/Greenstand/treetracker-field-data/commit/5d06aadd52c1c83b248bf2fcdebea658e9a220c5))

## [1.6.1](https://github.com/Greenstand/treetracker-field-data/compare/v1.6.0...v1.6.1) (2022-02-09)


### Bug Fixes

* update sealed secret to remove treetracker_dev ([c9b027b](https://github.com/Greenstand/treetracker-field-data/commit/c9b027b6f2721122ae5719c2ccf633f94006afc8))

# [1.6.0](https://github.com/Greenstand/treetracker-field-data/compare/v1.5.0...v1.6.0) (2021-11-05)


### Features

* add log ([05faf20](https://github.com/Greenstand/treetracker-field-data/commit/05faf207fdfef3796e687a8bfd95de108cd3cec1))

# [1.5.0](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.12...v1.5.0) (2021-11-05)


### Features

* add log ([25ffb2d](https://github.com/Greenstand/treetracker-field-data/commit/25ffb2dcf7d507fcaabf613b32298463ab18d477))

## [1.4.12](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.11...v1.4.12) (2021-10-27)


### Bug Fixes

* allow empty value in attributes ([96ff272](https://github.com/Greenstand/treetracker-field-data/commit/96ff272fd3026a5d76dc4adcc90572a0c131ec97))

## [1.4.11](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.10...v1.4.11) (2021-10-27)


### Bug Fixes

* cannot use empty array as allow ([b7903bf](https://github.com/Greenstand/treetracker-field-data/commit/b7903bfad56814aea37c5e913a36f738af3b48a3))

## [1.4.10](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.9...v1.4.10) (2021-10-27)


### Bug Fixes

* allow empty array ([9ef4dc9](https://github.com/Greenstand/treetracker-field-data/commit/9ef4dc97514cb2be6bfc5ccc5e2bb8ee34537cab))
* allow null array ([4cb6b58](https://github.com/Greenstand/treetracker-field-data/commit/4cb6b58723516f64e93adf5ef0dd7e42c0781275))

## [1.4.9](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.8...v1.4.9) (2021-10-27)


### Bug Fixes

* update to node 16 image ([ed86c28](https://github.com/Greenstand/treetracker-field-data/commit/ed86c2827642b38257ca111984871c5da6579236))

## [1.4.8](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.7...v1.4.8) (2021-10-27)


### Bug Fixes

* correct range for lat and lon ([b727bfa](https://github.com/Greenstand/treetracker-field-data/commit/b727bfa8fe05e31634ee81225a7471bae490a17b))
* improve raw capture body schema ([74e217d](https://github.com/Greenstand/treetracker-field-data/commit/74e217d4f03b99d58b4635cfa033a3b41eee9955))
* update package-lock ([e723c91](https://github.com/Greenstand/treetracker-field-data/commit/e723c919c0d91e05d73fe1141152f5da203c8f45))

## [1.4.7](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.6...v1.4.7) (2021-10-14)


### Bug Fixes

* correct namespace on sealed secret ([c6a4a71](https://github.com/Greenstand/treetracker-field-data/commit/c6a4a71700947a0feba54ce29603a0b5127a7f4d))

## [1.4.6](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.5...v1.4.6) (2021-10-14)


### Bug Fixes

* update rabbitmq secrets to use new namespace ([5c6d621](https://github.com/Greenstand/treetracker-field-data/commit/5c6d621ab25806da55640d1f322274fd76821d60))

## [1.4.5](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.4...v1.4.5) (2021-10-05)


### Bug Fixes

* fix name of sealed secret ([48f7b94](https://github.com/Greenstand/treetracker-field-data/commit/48f7b945c9d121c6ef1551b27254b472fa486aeb))

## [1.4.4](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.3...v1.4.4) (2021-10-05)


### Bug Fixes

* add production database connection sealed secret ([07afd61](https://github.com/Greenstand/treetracker-field-data/commit/07afd615f49316a4b9915b9caa387ea63e614740))
* add production rabbitmq sealed secret ([8e2ddd7](https://github.com/Greenstand/treetracker-field-data/commit/8e2ddd744e82c3aa4a8c33bf6c7c9b58e57e4013))
* correct kustomization for rabbitmq ([98e952e](https://github.com/Greenstand/treetracker-field-data/commit/98e952e73e2bc7c1715db60ae0326c374d9709d4))
* correct rabbitmq sealed secret for test ([9e4b330](https://github.com/Greenstand/treetracker-field-data/commit/9e4b33029655bcaa44c7aaff5c906d158b005adf))

## [1.4.3](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.2...v1.4.3) (2021-10-05)


### Bug Fixes

* correct rabbitmq sealed secret for dev ([eeaed82](https://github.com/Greenstand/treetracker-field-data/commit/eeaed82954eace7e7572f977a154cad8f754881f))

## [1.4.2](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.1...v1.4.2) (2021-10-05)


### Bug Fixes

* sealed secret was sealed against wrong cluster ([6f661e1](https://github.com/Greenstand/treetracker-field-data/commit/6f661e1435c45f5030b8a4b14f1d3704475b84a5))

## [1.4.1](https://github.com/Greenstand/treetracker-field-data/compare/v1.4.0...v1.4.1) (2021-10-05)


### Bug Fixes

* fix deployment ([1425186](https://github.com/Greenstand/treetracker-field-data/commit/1425186a504ac4530e90947191ddb24b59c0deb3))

# [1.4.0](https://github.com/Greenstand/treetracker-field-data/compare/v1.3.8...v1.4.0) (2021-10-05)


### Bug Fixes

* add port number to github postgres connection string ([2ceaf9e](https://github.com/Greenstand/treetracker-field-data/commit/2ceaf9ee6daf9c634758c517c6d1a9bce70c1080))
* fix name of sealed secret file ([67bf201](https://github.com/Greenstand/treetracker-field-data/commit/67bf20169ca2392557b94ce744ca8c24cf82640b))
* fix path and name of sealed secret ([d3218b7](https://github.com/Greenstand/treetracker-field-data/commit/d3218b745f48433f9267905031a9467a1ca2f8f2))
* fix path and name of sealed secret ([fbdbf0a](https://github.com/Greenstand/treetracker-field-data/commit/fbdbf0a38d8a1d479276c10fb16d7c7f4f45e073))
* modify github connection string ([9db06a8](https://github.com/Greenstand/treetracker-field-data/commit/9db06a836c9d4e591cb6d6c71ba0e3644e34abf5))
* update amqplib ([935c40e](https://github.com/Greenstand/treetracker-field-data/commit/935c40ef4708a37df490430899bb579e5d6b5a7b))
* update database connection sealed secrets to follow standard format ([340a209](https://github.com/Greenstand/treetracker-field-data/commit/340a2091efe9e5c983b41d643730757aa21b1a39))
* update to node 16 ([b13b63d](https://github.com/Greenstand/treetracker-field-data/commit/b13b63d1366ea8014cf380f1f30066e42890b9a6))


### Features

* add support for node 16 ([6bb13aa](https://github.com/Greenstand/treetracker-field-data/commit/6bb13aaef4423656302ee329f67f076184903f9e))
* add support for node 16 to pull request github action ([d491a13](https://github.com/Greenstand/treetracker-field-data/commit/d491a130e0963197026996cf538eff9dc00855cb))

## [1.3.8](https://github.com/Greenstand/treetracker-field-data/compare/v1.3.7...v1.3.8) (2021-10-05)


### Bug Fixes

* fix path and name of sealed secret ([e4989ef](https://github.com/Greenstand/treetracker-field-data/commit/e4989ef006f07d49d7669f2943420f231402ec17))

## [1.3.7](https://github.com/Greenstand/treetracker-field-data/compare/v1.3.6...v1.3.7) (2021-10-05)


### Bug Fixes

* fix path and name of sealed secret ([fae3900](https://github.com/Greenstand/treetracker-field-data/commit/fae39004dd1ef07bb8760b9fd47cb9abe5803c1e))

## [1.3.6](https://github.com/Greenstand/treetracker-field-data/compare/v1.3.5...v1.3.6) (2021-10-05)


### Bug Fixes

* fix name of sealed secret file ([5363530](https://github.com/Greenstand/treetracker-field-data/commit/536353082160c4718cd28695dd14c07c2d26bb47))

## [1.3.5](https://github.com/Greenstand/treetracker-field-data/compare/v1.3.4...v1.3.5) (2021-10-05)


### Bug Fixes

* update database connection sealed secrets to follow standard format ([37781b1](https://github.com/Greenstand/treetracker-field-data/commit/37781b1f605fc5eb09e982628a368af23dbbd3e4))
* update to node 16 ([7a58950](https://github.com/Greenstand/treetracker-field-data/commit/7a58950f901a88e4d11deb52c8dd06656623f7da))

## [1.3.4](https://github.com/Greenstand/treetracker-field-data/compare/v1.3.3...v1.3.4) (2021-07-29)


### Bug Fixes

* add kustomization.yaml to test and prod overlays ([95dceb1](https://github.com/Greenstand/treetracker-field-data/commit/95dceb1887cf379d28006717018d190806499bdb))

## [1.3.3](https://github.com/Greenstand/treetracker-field-data/compare/v1.3.2...v1.3.3) (2021-07-29)


### Bug Fixes

* add namespace to configuration ([5c85ca6](https://github.com/Greenstand/treetracker-field-data/commit/5c85ca61dcf76113e922abdbb17f9aab009986b3))

## [1.3.2](https://github.com/Greenstand/treetracker-field-data/compare/v1.3.1...v1.3.2) (2021-07-29)


### Bug Fixes

* use standardized secret file name ([ce4b3fd](https://github.com/Greenstand/treetracker-field-data/commit/ce4b3fd58bde95791875d8bef383aec3b3822812))

## [1.3.1](https://github.com/Greenstand/treetracker-field-data/compare/v1.3.0...v1.3.1) (2021-07-29)


### Bug Fixes

* use correct name for development overlay dir ([a390a5c](https://github.com/Greenstand/treetracker-field-data/commit/a390a5cadc5d3b63558011a43fbe81882195f2c1))

# [1.3.0](https://github.com/Greenstand/treetracker-field-data/compare/v1.2.1...v1.3.0) (2021-07-29)


### Bug Fixes

* add eslint configurations ([8c42f34](https://github.com/Greenstand/treetracker-field-data/commit/8c42f3423bc7a8a2145473c2578bd5399c3d9473))
* add install db-migrate to workflow ([8bafc4d](https://github.com/Greenstand/treetracker-field-data/commit/8bafc4d9c7b7ec0b14c99874fa32d4399c7a8481))
* add postgis docker image ([1a64ffa](https://github.com/Greenstand/treetracker-field-data/commit/1a64ffabaa6d0e1740c79b578e2b4bbd7c87fa5f))
* add sql query to test file ([755632c](https://github.com/Greenstand/treetracker-field-data/commit/755632cdcd66bda5b17cffcc4f20d8edf6ba6e09))
* api test script ([2fd6d15](https://github.com/Greenstand/treetracker-field-data/commit/2fd6d159a873219a2c397da2b79be36877689070))
* broken test: BaseRepository ([3f2d504](https://github.com/Greenstand/treetracker-field-data/commit/3f2d5047c91683ea2635c0043fe705106ad972ad))
* correct naming of overlays directory ([5942508](https://github.com/Greenstand/treetracker-field-data/commit/5942508463483b23b5cb739cc402e5dd7213263a))
* correct sql query ([fa62065](https://github.com/Greenstand/treetracker-field-data/commit/fa6206526c119102bcd8925d09c935f41fec77ba))
* correct sql query ([bf35f92](https://github.com/Greenstand/treetracker-field-data/commit/bf35f9257b3356d1b0800d2536e8eec3b2f1b65d))
* disable tests and lint for now ([39ec27f](https://github.com/Greenstand/treetracker-field-data/commit/39ec27f83f075076c5452330787e3c9f8c69d7c2))
* fix issues around legacy tree_attributes table ([fc6b7f0](https://github.com/Greenstand/treetracker-field-data/commit/fc6b7f09229ad9e9b13021d023e6a675a482669a))
* fix sql query ([32497ac](https://github.com/Greenstand/treetracker-field-data/commit/32497ac9959b8434558f79c69c233c138797e293))
* force trigger build ([54a99a9](https://github.com/Greenstand/treetracker-field-data/commit/54a99a93baeeb4ff159e6ce2b17f2104bc4e5217))
* modify sql query ([c625360](https://github.com/Greenstand/treetracker-field-data/commit/c6253600553c9f9bfb02e141af3e379f5e137542))
* modify sql query ([9bd909b](https://github.com/Greenstand/treetracker-field-data/commit/9bd909b17987119291be931dc5e95facd1d89051))
* modify sql query ([c17b6df](https://github.com/Greenstand/treetracker-field-data/commit/c17b6df7bdf3b2f8ddd9bcd403c6619d5a17c4ac))
* pr github workflow ([fa9f6d1](https://github.com/Greenstand/treetracker-field-data/commit/fa9f6d121826b18433085bf60dedcd06ab9dc433))
* pr github workflow ([146a88b](https://github.com/Greenstand/treetracker-field-data/commit/146a88b26a9827ae953ffd45b35994b462578cd2))
* pr github workflow ([b084785](https://github.com/Greenstand/treetracker-field-data/commit/b0847857bfce23750071a8ba7bef2b062694d4b2))
* pr github workflow ([b655f6c](https://github.com/Greenstand/treetracker-field-data/commit/b655f6cf817c3c6706c6ef0ffab2af7185f0e2f0))
* pr github workflow ([816dd22](https://github.com/Greenstand/treetracker-field-data/commit/816dd22bf7195f2b74effaf8aaa2d023784d7912))
* pr github workflow ([6ef1adc](https://github.com/Greenstand/treetracker-field-data/commit/6ef1adc21a7731fbc63fd968b428fbe1d9cf6825))
* pr github workflow ([087331b](https://github.com/Greenstand/treetracker-field-data/commit/087331bdff23fa562d0bba686749848ae019d0ad))
* pr github workflow ([f2795e8](https://github.com/Greenstand/treetracker-field-data/commit/f2795e8d1f63874bd77fb16f839c833dfe727940))
* pull-request-ci workflow ([2c146ec](https://github.com/Greenstand/treetracker-field-data/commit/2c146ece728b2eea265f2b96b9d30f5184327c1c))
* refactor raw_captures api test ([1a0eaa0](https://github.com/Greenstand/treetracker-field-data/commit/1a0eaa04ef684c79cdbf5b1ddf473364a637a44e))
* remove custom tree_id_seq  from sql query ([b2127dd](https://github.com/Greenstand/treetracker-field-data/commit/b2127dd99dba95f07239292d129757115c12886b))
* remove custom types from sql query ([2d15617](https://github.com/Greenstand/treetracker-field-data/commit/2d156171d63abb8a1f9336af6a16e7f159b0fd62))
* remove morphology_type from sql query ([09b629b](https://github.com/Greenstand/treetracker-field-data/commit/09b629b2517e79380441c77f3fb4d52fd96a9799))
* remove on push github action ([c50c279](https://github.com/Greenstand/treetracker-field-data/commit/c50c279550832dfd7efd1a76bf6087e667298817))
* switch to main branch in workflows ([80df363](https://github.com/Greenstand/treetracker-field-data/commit/80df3637e0fd8f9dd12edb086b0dfc2defd38f20))
* update deployment to follow overlay pattern for kustomize ([68b46c7](https://github.com/Greenstand/treetracker-field-data/commit/68b46c71ad5826c637ad61fa45cf900a7c071660))
* use main branch in releaserc ([39d0948](https://github.com/Greenstand/treetracker-field-data/commit/39d0948120eb56df4f1c3a2eb6bc3966484e7a03))


### Features

* add github actions for running of test ([6c2690f](https://github.com/Greenstand/treetracker-field-data/commit/6c2690f8f7db71bb37553e6100893f6c41bd0c29))
* add raw_captures api test ([3ef8b9e](https://github.com/Greenstand/treetracker-field-data/commit/3ef8b9e832ecfca1901a7de0b4babc88f3a771ea))
* event replay feature added ([99ab052](https://github.com/Greenstand/treetracker-field-data/commit/99ab0523ecb94136fbb17aaeab2264fe0b4fede5))
* event replay feature added ([b7d9e33](https://github.com/Greenstand/treetracker-field-data/commit/b7d9e33d51b2bad4e6480cc5caa289caac304c12))

## [1.2.1](https://github.com/Greenstand/treetracker-field-data/compare/v1.2.0...v1.2.1) (2021-05-15)


### Bug Fixes

* update the capture_taken_at migrations ([6472afd](https://github.com/Greenstand/treetracker-field-data/commit/6472afdb27c3bd51474d54fcf90147e5f76637c2))

# [1.2.0](https://github.com/Greenstand/treetracker-field-data/compare/v1.1.3...v1.2.0) (2021-05-13)


### Bug Fixes

* add capture_taken_at to the RawCaptureCreated event ([2f3dbd0](https://github.com/Greenstand/treetracker-field-data/commit/2f3dbd0c9ee433dcfde867e68e4f13e4946332cf))
* remove trailing comma ([3e4018b](https://github.com/Greenstand/treetracker-field-data/commit/3e4018bf4a229f59b6baebee9e2f2430fdef93be))


### Features

* add capture_taken_at column ([3832d7e](https://github.com/Greenstand/treetracker-field-data/commit/3832d7ea65971d67bf58b6c027e61be76fcd4b4f))

## [1.1.3](https://github.com/Greenstand/treetracker-field-data/compare/v1.1.2...v1.1.3) (2021-04-07)


### Bug Fixes

* use dns name for messaging system in k8 ([0c5b8ff](https://github.com/Greenstand/treetracker-field-data/commit/0c5b8ff86f830434c834607dc02d91ee5447bc16))

## [1.1.2](https://github.com/Greenstand/treetracker-field-data/compare/v1.1.1...v1.1.2) (2021-03-07)


### Bug Fixes

* add error handler to express global error handler ([27d8e00](https://github.com/Greenstand/treetracker-field-data/commit/27d8e00397ef2de8f5592f8788e3a34f8e7a9891))

## [1.1.1](https://github.com/Greenstand/treetracker-field-data/compare/v1.1.0...v1.1.1) (2021-02-14)


### Bug Fixes

* use repository signature instead of baserepository ([70ba712](https://github.com/Greenstand/treetracker-field-data/commit/70ba712d06eb7fcb6d251f7aaa44f599e2c1e530))

# [1.1.0](https://github.com/Greenstand/treetracker-field-data/compare/v1.0.0...v1.1.0) (2021-02-13)


### Bug Fixes

* remove  and use un/processed as status value ([ae9c231](https://github.com/Greenstand/treetracker-field-data/commit/ae9c231051f3cfb0e7fee41b2b700b028750c895))
* rename captureHandler to captureRouter ([cd91ec7](https://github.com/Greenstand/treetracker-field-data/commit/cd91ec7ad0199341320a27fc2eea59bf6f924dd8))
* rename planter_contact to planter_username ([83189e6](https://github.com/Greenstand/treetracker-field-data/commit/83189e6ef9e963cf4b3b7c7d461ede572ad2655e))


### Features

* consume verification events from admin panel ([58ba2d4](https://github.com/Greenstand/treetracker-field-data/commit/58ba2d4260260afcf078fffa4074c3e082235f90))
* revise repository interface methods ([e739687](https://github.com/Greenstand/treetracker-field-data/commit/e73968732a1142c949ac77f553e598dcfb1660d0))

# 1.0.0 (2021-02-03)


### Bug Fixes

* update legacy tree repository to save estimated geometric location ([2f959a0](https://github.com/Greenstand/treetracker-field-data/commit/2f959a0f792ddbfbea41bc6c57488366018e4568))
* update sealed secrets for dev env ([69f8cb7](https://github.com/Greenstand/treetracker-field-data/commit/69f8cb7a62a781d5967217e7e247427b29c53514))
