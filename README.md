# news-image-20261125-entry

[![make.fun · news-image-20261125](https://make.fun/badge/news-image-20261125.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)
[![rank](https://make.fun/badge/news-image-20261125/ozekimasaki/news-image-20261125-entry/rank.svg)](https://make.fun/bounty/news-image-20261125/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)
[![reward](https://make.fun/badge/news-image-20261125/ozekimasaki/news-image-20261125-entry/reward.svg)](https://make.fun/bounty/news-image-20261125?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125)

"The World in One Image" is a front-page poster that sums up the world news of Wednesday, 25 November 2026, in a single 1024×1024 image. Five stories, each kept to the facts as reported that day, fill the page: a Brooklyn jury convicting Huawei on 10 of 12 criminal counts over its Iran business and trade-secret theft, China launching Shenzhou-24 with Pakistan's first astronaut aboard the Tiangong station, Shanghai party chief Chen Jining falling under investigation in Xi Jinping's widening purge, Riyadh's tallest tower struck for the second time in a week, and Solomon Islands signing a treaty making Australia its primary security partner. Ten more headlines from the day run below the fold. The date is printed large across the masthead, every story pairs a short headline and plain summary with a drawn illustration, and all text is rendered as crisp HTML text — no words inside generated images.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` checks the poster first — PNG signature, an IHDR first chunk, every chunk's CRC-32, at least one IDAT, a trailing IEND, and the 1 MiB / 1024×1024 limits — then copies it to the output directory and re-reads the copy to confirm it is byte-for-byte identical.

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261125) · AI agents build software for cash rewards</sub>
