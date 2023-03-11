/**
 * Copyright 2020, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';



function main(projectId, location, inputUri, outputUri) {
  // [START transcoder_create_job_from_ad_hoc]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // projectId = 'my-project-id';
  // location = 'us-central1';
  // inputUri = 'gs://my-bucket/my-video-file';
  // outputUri = 'gs://my-bucket/my-output-folder/';

  // Imports the Transcoder library
  const {TranscoderServiceClient} =
    require('@google-cloud/video-transcoder').v1;

  // Instantiates a client
  const transcoderServiceClient = new TranscoderServiceClient();

  async function createJobFromAdHoc() {
    // Construct request
    const request = {
      parent: transcoderServiceClient.locationPath(projectId, location),
      job: {
        inputUri: inputUri,
        outputUri: outputUri,
        config: {
          elementaryStreams: [
            {
              key: 'video-stream-240p',
              videoStream: {
                h264: {
                  heightPixels: 240,
                  widthPixels: 426,
                  bitrateBps: 300000,
                  frameRate: 30,
                },
              },
            },
            {
              key: 'video-stream-360p',
              videoStream: {
                h264: {
                  heightPixels: 360,
                  widthPixels: 640,
                  bitrateBps: 400000,
                  frameRate: 60,
                },
              },
            },
            {
              key: 'video-stream-540p',
              videoStream: {
                h264: {
                  heightPixels: 540,
                  widthPixels: 960,
                  bitrateBps: 700000,
                  frameRate: 60,
                },
              },
            },
            {
              key: 'video-stream-720p',
              videoStream: {
                h264: {
                  heightPixels: 720,
                  widthPixels: 1280,
                  bitrateBps: 1200000,
                  frameRate: 60,
                },
              },
            },
            {
              key: 'audio-stream-acc-64',
              audioStream: {
                codec: 'aac',
                bitrateBps: 64000,
              },
            },
            {
              key: 'audio-stream-acc-96',
              audioStream: {
                codec: 'aac',
                bitrateBps: 96000,
              },
            },
          ],
          muxStreams: [
            // OUT HLS
            {
              key: 'hls-240p',
              container: 'ts',
              elementaryStreams: ['video-stream-240p', 'audio-stream-acc-64'],
            },
            {
              key: 'hls-360p',
              container: 'ts',
              elementaryStreams: ['video-stream-360p', 'audio-stream-acc-64'],
            },
            {
              key: 'hls-540p',
              container: 'ts',
              elementaryStreams: ['video-stream-540p', 'audio-stream-acc-96'],
            },
            {
              key: 'hls-720p',
              container: 'ts',
              elementaryStreams: ['video-stream-720p', 'audio-stream-acc-96'],
            },

            // OUT DASH
            {
              key: 'dash-240p',
              container: 'fmp4',
              elementaryStreams: ['video-stream-240p'],
            },
            {
              key: 'dash-360p',
              container: 'fmp4',
              elementaryStreams: ['video-stream-360p'],
            },
            {
              key: 'dash-540p',
              container: 'fmp4',
              elementaryStreams: ['video-stream-540p'],
            },
            {
              key: 'dash-720p',
              container: 'fmp4',
              elementaryStreams: ['video-stream-720p'],
            },
            {
              key: 'dash-audio-64',
              container: 'fmp4',
              elementaryStreams: ['audio-stream-acc-64'],
            },
            {
              key: 'dash-audio-96',
              container: 'fmp4',
              elementaryStreams: ['audio-stream-acc-96'],
            },

            // OUT MP4
            {
              key: 'video-320',
              container: 'mp4',
              elementaryStreams: ['video-stream-360p'],
            },
            {
              key: 'video-540',
              container: 'mp4',
              elementaryStreams: ['video-stream-540p'],
            },
            {
              key: 'video-720',
              container: 'mp4',
              elementaryStreams: ['video-stream-720p'],
            },
            {
              key: 'audio',
              container: 'mp4',
              elementaryStreams: ['audio-stream-acc-96'],
            }
          ],
          manifests: [
            {
              fileName: 'manifest.m3u8',
              type: 'HLS',
              muxStreams: ['hls-240p', 'hls-360p', 'hls-540p', 'hls-720p'],
            },
            {
              fileName: 'manifest.mpd',
              type: 'DASH',
              muxStreams: ['dash-240p', 'dash-360p', 'dash-540p', 'dash-720p', 'dash-audio-64', 'dash-audio-96'],
            },
          ],
        },
      },
    };

    // Run request
    const [response] = await transcoderServiceClient.createJob(request);
    console.log(`Job: ${response.name}`);
  }

  createJobFromAdHoc();
  // [END transcoder_create_job_from_ad_hoc]
}

// node createJobFromAdHoc.js <projectId> <location> <inputUri> <outputUri>
process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
