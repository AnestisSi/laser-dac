import * as Struct from 'ref-struct';
import * as ArrayType from 'ref-array';
import * as ffi from 'ffi';
import * as path from 'path';

export const HeliosPoint = Struct({
  x: 'uint16',
  y: 'uint16',
  r: 'uint8',
  g: 'uint8',
  b: 'uint8',
  i: 'uint8'
});

export const HeliosPointArray = ArrayType(HeliosPoint);

const libPath = path.join(__dirname, '../sdk/libHeliosDACAPI');

export const HeliosLib = ffi.Library(libPath, {
  //initializes drivers, opens connection to all devices.
  //Returns number of available devices.
  //NB: To re-scan for newly connected DACs after this function has once been called before, you must first call CloseDevices()
  OpenDevices: ['int', []],
  //Gets status from the specified dac.
  //Return 1 if ready to receive new frame, 0 if not, -1 if communcation failed
  GetStatus: ['int', ['int']],
  //stops, blanks and centers output on the specified dac
  //returns 1 if successful
  Stop: ['int', ['int']],
  //closes connection to all dacs and frees resources
  //should be called when library is no longer needed (program exit for example)
  CloseDevices: ['void', []],
  //writes and outputs a frame to the speficied dac
  //dacNum: dac number (0 to n where n+1 is the return value from OpenDevices() )
  //pps: rate of output in points per second
  //flags: (default is 0)
  //	Bit 0 (LSB) = if true, start output immediately, instead of waiting for current frame (if there is one) to finish playing
  //	Bit 1 = if true, play frame only once, instead of repeating until another frame is written
  //	Bit 2-7 = reserved
  //points: pointer to point data. See point structure documentation in HeliosDac.h
  //numOfPoints: number of points in the frame
  //returns 1 if successful
  WriteFrame: ['int', ['int', 'int', 'int', HeliosPointArray, 'int']]
});
