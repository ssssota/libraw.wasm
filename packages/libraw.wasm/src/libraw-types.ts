import * as __typ from 'typed-cstruct';
export function __fsid_t() {
  return new __typ.Struct()
    .field('__val', __typ.sizedArray(__typ.i32,2))
}
export function _IO_marker() {
  return new __typ.Struct()
    .field('_unused', __typ.sizedArray(__typ.u8,0))
}
export function _IO_codecvt() {
  return new __typ.Struct()
    .field('_unused', __typ.sizedArray(__typ.u8,0))
}
export function _IO_wide_data() {
  return new __typ.Struct()
    .field('_unused', __typ.sizedArray(__typ.u8,0))
}
export function div_t() {
  return new __typ.Struct()
    .field('quot', __typ.i32)
    .field('rem', __typ.i32)
}
export function ldiv_t() {
  return new __typ.Struct()
    .field('quot', __typ.i64)
    .field('rem', __typ.i64)
}
export function lldiv_t() {
  return new __typ.Struct()
    .field('quot', __typ.i64)
    .field('rem', __typ.i64)
}
export function __sigset_t() {
  return new __typ.Struct()
    .field('__val', __typ.sizedArray(__typ.u64,16))
}
export function timeval() {
  return new __typ.Struct()
    .field('tv_sec', __time_t())
    .field('tv_usec', __suseconds_t())
}
export function timespec() {
  return new __typ.Struct()
    .field('tv_sec', __time_t())
    .field('tv_nsec', __syscall_slong_t())
}
export function fd_set() {
  return new __typ.Struct()
    .field('__fds_bits', __typ.sizedArray(__fd_mask(),16))
}
export function __atomic_wide_counter__bindgen_ty_1() {
  return new __typ.Struct()
    .field('__low', __typ.u32)
    .field('__high', __typ.u32)
}
export function __pthread_rwlock_arch_t() {
  return new __typ.Struct()
    .field('__readers', __typ.u32)
    .field('__writers', __typ.u32)
    .field('__wrphase_futex', __typ.u32)
    .field('__writers_futex', __typ.u32)
    .field('__pad3', __typ.u32)
    .field('__pad4', __typ.u32)
    .field('__cur_writer', __typ.i32)
    .field('__shared', __typ.i32)
    .field('__pad1', __typ.u64)
    .field('__pad2', __typ.u64)
    .field('__flags', __typ.u32)
}
export function __once_flag() {
  return new __typ.Struct()
    .field('__data', __typ.i32)
}
export function random_data() {
  return new __typ.Struct()
    .field('fptr', __typ.ptr(__typ.i32))
    .field('rptr', __typ.ptr(__typ.i32))
    .field('state', __typ.ptr(__typ.i32))
    .field('rand_type', __typ.i32)
    .field('rand_deg', __typ.i32)
    .field('rand_sep', __typ.i32)
    .field('end_ptr', __typ.ptr(__typ.i32))
}
export function drand48_data() {
  return new __typ.Struct()
    .field('__x', __typ.sizedArray(__typ.u16,3))
    .field('__old_x', __typ.sizedArray(__typ.u16,3))
    .field('__c', __typ.u16)
    .field('__init', __typ.u16)
    .field('__a', __typ.u64)
}
export function timezone() {
  return new __typ.Struct()
    .field('tz_minuteswest', __typ.i32)
    .field('tz_dsttime', __typ.i32)
}
export function itimerval() {
  return new __typ.Struct()
    .field('it_interval', timeval())
    .field('it_value', timeval())
}
export function imaxdiv_t() {
  return new __typ.Struct()
    .field('quot', __typ.i64)
    .field('rem', __typ.i64)
}
export function libraw_decoder_info_t() {
  return new __typ.Struct()
    .field('decoder_name', __typ.ptr(__typ.u8))
    .field('decoder_flags', __typ.u32)
}
export function libraw_internal_output_params_t() {
  return new __typ.Struct()
    .field('mix_green', __typ.u32)
    .field('raw_color', __typ.u32)
    .field('zero_is_bad', __typ.u32)
    .field('shrink', ushort())
    .field('fuji_width', ushort())
}
export function libraw_callbacks_t() {
  return new __typ.Struct()
    .field('data_cb', data_callback())
    .field('datacb_data', __typ.ptr(__typ.u32))
    .field('progress_cb', progress_callback())
    .field('progresscb_data', __typ.ptr(__typ.u32))
    .field('exif_cb', exif_parser_callback())
    .field('exifparser_data', __typ.ptr(__typ.u32))
    .field('pre_identify_cb', pre_identify_callback())
    .field('post_identify_cb', post_identify_callback())
    .field('pre_subtractblack_cb', process_step_callback())
    .field('pre_scalecolors_cb', process_step_callback())
    .field('pre_preinterpolate_cb', process_step_callback())
    .field('pre_interpolate_cb', process_step_callback())
    .field('interpolate_bayer_cb', process_step_callback())
    .field('interpolate_xtrans_cb', process_step_callback())
    .field('post_interpolate_cb', process_step_callback())
    .field('pre_converttorgb_cb', process_step_callback())
    .field('post_converttorgb_cb', process_step_callback())
}
export function libraw_processed_image_t() {
  return new __typ.Struct()
    .field('type_', LibRaw_image_formats())
    .field('height', ushort())
    .field('width', ushort())
    .field('colors', ushort())
    .field('bits', ushort())
    .field('data_size', __typ.u32)
    .field('data', __typ.sizedArray(__typ.u8,1))
}
export function libraw_iparams_t() {
  return new __typ.Struct()
    .field('guard', __typ.sizedArray(__typ.u8,4))
    .field('make', __typ.sizedArray(__typ.u8,64))
    .field('model', __typ.sizedArray(__typ.u8,64))
    .field('software', __typ.sizedArray(__typ.u8,64))
    .field('normalized_make', __typ.sizedArray(__typ.u8,64))
    .field('normalized_model', __typ.sizedArray(__typ.u8,64))
    .field('maker_index', __typ.u32)
    .field('raw_count', __typ.u32)
    .field('dng_version', __typ.u32)
    .field('is_foveon', __typ.u32)
    .field('colors', __typ.i32)
    .field('filters', __typ.u32)
    .field('xtrans', __typ.sizedArray(__typ.sizedArray(__typ.u8,6),6))
    .field('xtrans_abs', __typ.sizedArray(__typ.sizedArray(__typ.u8,6),6))
    .field('cdesc', __typ.sizedArray(__typ.u8,5))
    .field('xmplen', __typ.u32)
    .field('xmpdata', __typ.ptr(__typ.u8))
}
export function libraw_raw_inset_crop_t() {
  return new __typ.Struct()
    .field('cleft', ushort())
    .field('ctop', ushort())
    .field('cwidth', ushort())
    .field('cheight', ushort())
}
export function libraw_image_sizes_t() {
  return new __typ.Struct()
    .field('raw_height', ushort())
    .field('raw_width', ushort())
    .field('height', ushort())
    .field('width', ushort())
    .field('top_margin', ushort())
    .field('left_margin', ushort())
    .field('iheight', ushort())
    .field('iwidth', ushort())
    .field('raw_pitch', __typ.u32)
    .field('pixel_aspect', __typ.f64)
    .field('flip', __typ.i32)
    .field('mask', __typ.sizedArray(__typ.sizedArray(__typ.i32,4),8))
    .field('raw_aspect', ushort())
    .field('raw_inset_crops', __typ.sizedArray(libraw_raw_inset_crop_t(),2))
}
export function libraw_area_t() {
  return new __typ.Struct()
    .field('t', __typ.i16)
    .field('l', __typ.i16)
    .field('b', __typ.i16)
    .field('r', __typ.i16)
}
export function ph1_t() {
  return new __typ.Struct()
    .field('format', __typ.i32)
    .field('key_off', __typ.i32)
    .field('tag_21a', __typ.i32)
    .field('t_black', __typ.i32)
    .field('split_col', __typ.i32)
    .field('black_col', __typ.i32)
    .field('split_row', __typ.i32)
    .field('black_row', __typ.i32)
    .field('tag_210', __typ.f32)
}
export function libraw_dng_color_t() {
  return new __typ.Struct()
    .field('parsedfields', __typ.u32)
    .field('illuminant', ushort())
    .field('calibration', __typ.sizedArray(__typ.sizedArray(__typ.f32,4),4))
    .field('colormatrix', __typ.sizedArray(__typ.sizedArray(__typ.f32,3),4))
    .field('forwardmatrix', __typ.sizedArray(__typ.sizedArray(__typ.f32,4),3))
}
export function libraw_dng_levels_t() {
  return new __typ.Struct()
    .field('parsedfields', __typ.u32)
    .field('dng_cblack', __typ.sizedArray(__typ.u32,4104))
    .field('dng_black', __typ.u32)
    .field('dng_fcblack', __typ.sizedArray(__typ.f32,4104))
    .field('dng_fblack', __typ.f32)
    .field('dng_whitelevel', __typ.sizedArray(__typ.u32,4))
    .field('default_crop', __typ.sizedArray(ushort(),4))
    .field('user_crop', __typ.sizedArray(__typ.f32,4))
    .field('preview_colorspace', __typ.u32)
    .field('analogbalance', __typ.sizedArray(__typ.f32,4))
    .field('asshotneutral', __typ.sizedArray(__typ.f32,4))
    .field('baseline_exposure', __typ.f32)
    .field('LinearResponseLimit', __typ.f32)
}
export function libraw_P1_color_t() {
  return new __typ.Struct()
    .field('romm_cam', __typ.sizedArray(__typ.f32,9))
}
export function libraw_canon_makernotes_t() {
  return new __typ.Struct()
    .field('ColorDataVer', __typ.i32)
    .field('ColorDataSubVer', __typ.i32)
    .field('SpecularWhiteLevel', __typ.i32)
    .field('NormalWhiteLevel', __typ.i32)
    .field('ChannelBlackLevel', __typ.sizedArray(__typ.i32,4))
    .field('AverageBlackLevel', __typ.i32)
    .field('multishot', __typ.sizedArray(__typ.u32,4))
    .field('MeteringMode', __typ.i16)
    .field('SpotMeteringMode', __typ.i16)
    .field('FlashMeteringMode', uchar())
    .field('FlashExposureLock', __typ.i16)
    .field('ExposureMode', __typ.i16)
    .field('AESetting', __typ.i16)
    .field('ImageStabilization', __typ.i16)
    .field('FlashMode', __typ.i16)
    .field('FlashActivity', __typ.i16)
    .field('FlashBits', __typ.i16)
    .field('ManualFlashOutput', __typ.i16)
    .field('FlashOutput', __typ.i16)
    .field('FlashGuideNumber', __typ.i16)
    .field('ContinuousDrive', __typ.i16)
    .field('SensorWidth', __typ.i16)
    .field('SensorHeight', __typ.i16)
    .field('AFMicroAdjMode', __typ.i32)
    .field('AFMicroAdjValue', __typ.f32)
    .field('MakernotesFlip', __typ.i16)
    .field('RecordMode', __typ.i16)
    .field('SRAWQuality', __typ.i16)
    .field('wbi', __typ.u32)
    .field('RF_lensID', __typ.i16)
    .field('AutoLightingOptimizer', __typ.i32)
    .field('HighlightTonePriority', __typ.i32)
    .field('Quality', __typ.i16)
    .field('CanonLog', __typ.i32)
    .field('DefaultCropAbsolute', libraw_area_t())
    .field('RecommendedImageArea', libraw_area_t())
    .field('LeftOpticalBlack', libraw_area_t())
    .field('UpperOpticalBlack', libraw_area_t())
    .field('ActiveArea', libraw_area_t())
    .field('ISOgain', __typ.sizedArray(__typ.i16,2))
}
export function libraw_hasselblad_makernotes_t() {
  return new __typ.Struct()
    .field('BaseISO', __typ.i32)
    .field('Gain', __typ.f64)
    .field('Sensor', __typ.sizedArray(__typ.u8,8))
    .field('SensorUnit', __typ.sizedArray(__typ.u8,64))
    .field('HostBody', __typ.sizedArray(__typ.u8,64))
    .field('SensorCode', __typ.i32)
    .field('SensorSubCode', __typ.i32)
    .field('CoatingCode', __typ.i32)
    .field('uncropped', __typ.i32)
    .field('CaptureSequenceInitiator', __typ.sizedArray(__typ.u8,32))
    .field('SensorUnitConnector', __typ.sizedArray(__typ.u8,64))
    .field('format', __typ.i32)
    .field('nIFD_CM', __typ.sizedArray(__typ.i32,2))
    .field('RecommendedCrop', __typ.sizedArray(__typ.i32,2))
    .field('mnColorMatrix', __typ.sizedArray(__typ.sizedArray(__typ.f64,3),4))
}
export function libraw_fuji_info_t() {
  return new __typ.Struct()
    .field('ExpoMidPointShift', __typ.f32)
    .field('DynamicRange', ushort())
    .field('FilmMode', ushort())
    .field('DynamicRangeSetting', ushort())
    .field('DevelopmentDynamicRange', ushort())
    .field('AutoDynamicRange', ushort())
    .field('DRangePriority', ushort())
    .field('DRangePriorityAuto', ushort())
    .field('DRangePriorityFixed', ushort())
    .field('FujiModel', __typ.sizedArray(__typ.u8,33))
    .field('FujiModel2', __typ.sizedArray(__typ.u8,33))
    .field('BrightnessCompensation', __typ.f32)
    .field('FocusMode', ushort())
    .field('AFMode', ushort())
    .field('FocusPixel', __typ.sizedArray(ushort(),2))
    .field('PrioritySettings', ushort())
    .field('FocusSettings', __typ.u32)
    .field('AF_C_Settings', __typ.u32)
    .field('FocusWarning', ushort())
    .field('ImageStabilization', __typ.sizedArray(ushort(),3))
    .field('FlashMode', ushort())
    .field('WB_Preset', ushort())
    .field('ShutterType', ushort())
    .field('ExrMode', ushort())
    .field('Macro', ushort())
    .field('Rating', __typ.u32)
    .field('CropMode', ushort())
    .field('SerialSignature', __typ.sizedArray(__typ.u8,13))
    .field('SensorID', __typ.sizedArray(__typ.u8,5))
    .field('RAFVersion', __typ.sizedArray(__typ.u8,5))
    .field('RAFDataGeneration', __typ.i32)
    .field('RAFDataVersion', ushort())
    .field('isTSNERDTS', __typ.i32)
    .field('DriveMode', __typ.i16)
    .field('BlackLevel', __typ.sizedArray(ushort(),9))
    .field('RAFData_ImageSizeTable', __typ.sizedArray(__typ.u32,32))
    .field('AutoBracketing', __typ.i32)
    .field('SequenceNumber', __typ.i32)
    .field('SeriesLength', __typ.i32)
    .field('PixelShiftOffset', __typ.sizedArray(__typ.f32,2))
    .field('ImageCount', __typ.i32)
}
export function libraw_sensor_highspeed_crop_t() {
  return new __typ.Struct()
    .field('cleft', ushort())
    .field('ctop', ushort())
    .field('cwidth', ushort())
    .field('cheight', ushort())
}
export function libraw_nikon_makernotes_t() {
  return new __typ.Struct()
    .field('ExposureBracketValue', __typ.f64)
    .field('ActiveDLighting', ushort())
    .field('ShootingMode', ushort())
    .field('ImageStabilization', __typ.sizedArray(uchar(),7))
    .field('VibrationReduction', uchar())
    .field('VRMode', uchar())
    .field('FlashSetting', __typ.sizedArray(__typ.u8,13))
    .field('FlashType', __typ.sizedArray(__typ.u8,20))
    .field('FlashExposureCompensation', __typ.sizedArray(uchar(),4))
    .field('ExternalFlashExposureComp', __typ.sizedArray(uchar(),4))
    .field('FlashExposureBracketValue', __typ.sizedArray(uchar(),4))
    .field('FlashMode', uchar())
    .field('FlashExposureCompensation2', __typ.i8)
    .field('FlashExposureCompensation3', __typ.i8)
    .field('FlashExposureCompensation4', __typ.i8)
    .field('FlashSource', uchar())
    .field('FlashFirmware', __typ.sizedArray(uchar(),2))
    .field('ExternalFlashFlags', uchar())
    .field('FlashControlCommanderMode', uchar())
    .field('FlashOutputAndCompensation', uchar())
    .field('FlashFocalLength', uchar())
    .field('FlashGNDistance', uchar())
    .field('FlashGroupControlMode', __typ.sizedArray(uchar(),4))
    .field('FlashGroupOutputAndCompensation', __typ.sizedArray(uchar(),4))
    .field('FlashColorFilter', uchar())
    .field('NEFCompression', ushort())
    .field('ExposureMode', __typ.i32)
    .field('ExposureProgram', __typ.i32)
    .field('nMEshots', __typ.i32)
    .field('MEgainOn', __typ.i32)
    .field('ME_WB', __typ.sizedArray(__typ.f64,4))
    .field('AFFineTune', uchar())
    .field('AFFineTuneIndex', uchar())
    .field('AFFineTuneAdj', __typ.i8)
    .field('LensDataVersion', __typ.u32)
    .field('FlashInfoVersion', __typ.u32)
    .field('ColorBalanceVersion', __typ.u32)
    .field('key', uchar())
    .field('NEFBitDepth', __typ.sizedArray(ushort(),4))
    .field('HighSpeedCropFormat', ushort())
    .field('SensorHighSpeedCrop', libraw_sensor_highspeed_crop_t())
    .field('SensorWidth', ushort())
    .field('SensorHeight', ushort())
    .field('Active_D_Lighting', ushort())
    .field('PictureControlVersion', __typ.u32)
    .field('PictureControlName', __typ.sizedArray(__typ.u8,20))
    .field('PictureControlBase', __typ.sizedArray(__typ.u8,20))
    .field('ShotInfoVersion', __typ.u32)
    .field('MakernotesFlip', __typ.i16)
    .field('RollAngle', __typ.f64)
    .field('PitchAngle', __typ.f64)
    .field('YawAngle', __typ.f64)
}
export function libraw_olympus_makernotes_t() {
  return new __typ.Struct()
    .field('CameraType2', __typ.sizedArray(__typ.u8,6))
    .field('ValidBits', ushort())
    .field('SensorCalibration', __typ.sizedArray(__typ.i32,2))
    .field('DriveMode', __typ.sizedArray(ushort(),5))
    .field('ColorSpace', ushort())
    .field('FocusMode', __typ.sizedArray(ushort(),2))
    .field('AutoFocus', ushort())
    .field('AFPoint', ushort())
    .field('AFAreas', __typ.sizedArray(__typ.u32,64))
    .field('AFPointSelected', __typ.sizedArray(__typ.f64,5))
    .field('AFResult', ushort())
    .field('AFFineTune', uchar())
    .field('AFFineTuneAdj', __typ.sizedArray(__typ.i16,3))
    .field('SpecialMode', __typ.sizedArray(__typ.u32,3))
    .field('ZoomStepCount', ushort())
    .field('FocusStepCount', ushort())
    .field('FocusStepInfinity', ushort())
    .field('FocusStepNear', ushort())
    .field('FocusDistance', __typ.f64)
    .field('AspectFrame', __typ.sizedArray(ushort(),4))
    .field('StackedImage', __typ.sizedArray(__typ.u32,2))
    .field('isLiveND', uchar())
    .field('LiveNDfactor', __typ.u32)
    .field('Panorama_mode', ushort())
    .field('Panorama_frameNum', ushort())
}
export function libraw_panasonic_makernotes_t() {
  return new __typ.Struct()
    .field('Compression', ushort())
    .field('BlackLevelDim', ushort())
    .field('BlackLevel', __typ.sizedArray(__typ.f32,8))
    .field('Multishot', __typ.u32)
    .field('gamma', __typ.f32)
    .field('HighISOMultiplier', __typ.sizedArray(__typ.i32,3))
    .field('FocusStepNear', __typ.i16)
    .field('FocusStepCount', __typ.i16)
    .field('ZoomPosition', __typ.u32)
    .field('LensManufacturer', __typ.u32)
}
export function libraw_pentax_makernotes_t() {
  return new __typ.Struct()
    .field('DriveMode', __typ.sizedArray(uchar(),4))
    .field('FocusMode', __typ.sizedArray(ushort(),2))
    .field('AFPointSelected', __typ.sizedArray(ushort(),2))
    .field('AFPointSelected_Area', ushort())
    .field('AFPointsInFocus_version', __typ.i32)
    .field('AFPointsInFocus', __typ.u32)
    .field('FocusPosition', ushort())
    .field('AFAdjustment', __typ.i16)
    .field('AFPointMode', uchar())
    .field('MultiExposure', uchar())
    .field('Quality', ushort())
}
export function libraw_ricoh_makernotes_t() {
  return new __typ.Struct()
    .field('AFStatus', ushort())
    .field('AFAreaXPosition', __typ.sizedArray(__typ.u32,2))
    .field('AFAreaYPosition', __typ.sizedArray(__typ.u32,2))
    .field('AFAreaMode', ushort())
    .field('SensorWidth', __typ.u32)
    .field('SensorHeight', __typ.u32)
    .field('CroppedImageWidth', __typ.u32)
    .field('CroppedImageHeight', __typ.u32)
    .field('WideAdapter', ushort())
    .field('CropMode', ushort())
    .field('NDFilter', ushort())
    .field('AutoBracketing', ushort())
    .field('MacroMode', ushort())
    .field('FlashMode', ushort())
    .field('FlashExposureComp', __typ.f64)
    .field('ManualFlashOutput', __typ.f64)
}
export function libraw_samsung_makernotes_t() {
  return new __typ.Struct()
    .field('ImageSizeFull', __typ.sizedArray(__typ.u32,4))
    .field('ImageSizeCrop', __typ.sizedArray(__typ.u32,4))
    .field('ColorSpace', __typ.sizedArray(__typ.i32,2))
    .field('key', __typ.sizedArray(__typ.u32,11))
    .field('DigitalGain', __typ.f64)
    .field('DeviceType', __typ.i32)
    .field('LensFirmware', __typ.sizedArray(__typ.u8,32))
}
export function libraw_kodak_makernotes_t() {
  return new __typ.Struct()
    .field('BlackLevelTop', ushort())
    .field('BlackLevelBottom', ushort())
    .field('offset_left', __typ.i16)
    .field('offset_top', __typ.i16)
    .field('clipBlack', ushort())
    .field('clipWhite', ushort())
    .field('romm_camDaylight', __typ.sizedArray(__typ.sizedArray(__typ.f32,3),3))
    .field('romm_camTungsten', __typ.sizedArray(__typ.sizedArray(__typ.f32,3),3))
    .field('romm_camFluorescent', __typ.sizedArray(__typ.sizedArray(__typ.f32,3),3))
    .field('romm_camFlash', __typ.sizedArray(__typ.sizedArray(__typ.f32,3),3))
    .field('romm_camCustom', __typ.sizedArray(__typ.sizedArray(__typ.f32,3),3))
    .field('romm_camAuto', __typ.sizedArray(__typ.sizedArray(__typ.f32,3),3))
    .field('val018percent', ushort())
    .field('val100percent', ushort())
    .field('val170percent', ushort())
    .field('MakerNoteKodak8a', __typ.i16)
    .field('ISOCalibrationGain', __typ.f32)
    .field('AnalogISO', __typ.f32)
}
export function libraw_p1_makernotes_t() {
  return new __typ.Struct()
    .field('Software', __typ.sizedArray(__typ.u8,64))
    .field('SystemType', __typ.sizedArray(__typ.u8,64))
    .field('FirmwareString', __typ.sizedArray(__typ.u8,256))
    .field('SystemModel', __typ.sizedArray(__typ.u8,64))
}
export function libraw_sony_info_t() {
  return new __typ.Struct()
    .field('CameraType', ushort())
    .field('Sony0x9400_version', uchar())
    .field('Sony0x9400_ReleaseMode2', uchar())
    .field('Sony0x9400_SequenceImageNumber', __typ.u32)
    .field('Sony0x9400_SequenceLength1', uchar())
    .field('Sony0x9400_SequenceFileNumber', __typ.u32)
    .field('Sony0x9400_SequenceLength2', uchar())
    .field('AFAreaModeSetting', __typ.u8)
    .field('AFAreaMode', __typ.u16)
    .field('FlexibleSpotPosition', __typ.sizedArray(ushort(),2))
    .field('AFPointSelected', __typ.u8)
    .field('AFPointSelected_0x201e', __typ.u8)
    .field('nAFPointsUsed', __typ.i16)
    .field('AFPointsUsed', __typ.sizedArray(__typ.u8,10))
    .field('AFTracking', __typ.u8)
    .field('AFType', __typ.u8)
    .field('FocusLocation', __typ.sizedArray(ushort(),4))
    .field('FocusPosition', ushort())
    .field('AFMicroAdjValue', __typ.i8)
    .field('AFMicroAdjOn', __typ.i8)
    .field('AFMicroAdjRegisteredLenses', uchar())
    .field('VariableLowPassFilter', ushort())
    .field('LongExposureNoiseReduction', __typ.u32)
    .field('HighISONoiseReduction', ushort())
    .field('HDR', __typ.sizedArray(ushort(),2))
    .field('group2010', ushort())
    .field('group9050', ushort())
    .field('len_group9050', ushort())
    .field('real_iso_offset', ushort())
    .field('MeteringMode_offset', ushort())
    .field('ExposureProgram_offset', ushort())
    .field('ReleaseMode2_offset', ushort())
    .field('MinoltaCamID', __typ.u32)
    .field('firmware', __typ.f32)
    .field('ImageCount3_offset', ushort())
    .field('ImageCount3', __typ.u32)
    .field('ElectronicFrontCurtainShutter', __typ.u32)
    .field('MeteringMode2', ushort())
    .field('SonyDateTime', __typ.sizedArray(__typ.u8,20))
    .field('ShotNumberSincePowerUp', __typ.u32)
    .field('PixelShiftGroupPrefix', ushort())
    .field('PixelShiftGroupID', __typ.u32)
    .field('nShotsInPixelShiftGroup', __typ.u8)
    .field('numInPixelShiftGroup', __typ.u8)
    .field('prd_ImageHeight', ushort())
    .field('prd_ImageWidth', ushort())
    .field('prd_Total_bps', ushort())
    .field('prd_Active_bps', ushort())
    .field('prd_StorageMethod', ushort())
    .field('prd_BayerPattern', ushort())
    .field('SonyRawFileType', ushort())
    .field('RAWFileType', ushort())
    .field('RawSizeType', ushort())
    .field('Quality', __typ.u32)
    .field('FileFormat', ushort())
    .field('MetaVersion', __typ.sizedArray(__typ.u8,16))
    .field('AspectRatio', __typ.f32)
}
export function libraw_colordata_t() {
  return new __typ.Struct()
    .field('curve', __typ.sizedArray(ushort(),65536))
    .field('cblack', __typ.sizedArray(__typ.u32,4104))
    .field('black', __typ.u32)
    .field('data_maximum', __typ.u32)
    .field('maximum', __typ.u32)
    .field('linear_max', __typ.sizedArray(__typ.i64,4))
    .field('fmaximum', __typ.f32)
    .field('fnorm', __typ.f32)
    .field('white', __typ.sizedArray(__typ.sizedArray(ushort(),8),8))
    .field('cam_mul', __typ.sizedArray(__typ.f32,4))
    .field('pre_mul', __typ.sizedArray(__typ.f32,4))
    .field('cmatrix', __typ.sizedArray(__typ.sizedArray(__typ.f32,4),3))
    .field('ccm', __typ.sizedArray(__typ.sizedArray(__typ.f32,4),3))
    .field('rgb_cam', __typ.sizedArray(__typ.sizedArray(__typ.f32,4),3))
    .field('cam_xyz', __typ.sizedArray(__typ.sizedArray(__typ.f32,3),4))
    .field('phase_one_data', ph1_t())
    .field('flash_used', __typ.f32)
    .field('canon_ev', __typ.f32)
    .field('model2', __typ.sizedArray(__typ.u8,64))
    .field('UniqueCameraModel', __typ.sizedArray(__typ.u8,64))
    .field('LocalizedCameraModel', __typ.sizedArray(__typ.u8,64))
    .field('ImageUniqueID', __typ.sizedArray(__typ.u8,64))
    .field('RawDataUniqueID', __typ.sizedArray(__typ.u8,17))
    .field('OriginalRawFileName', __typ.sizedArray(__typ.u8,64))
    .field('profile', __typ.ptr(__typ.u32))
    .field('profile_length', __typ.u32)
    .field('black_stat', __typ.sizedArray(__typ.u32,8))
    .field('dng_color', __typ.sizedArray(libraw_dng_color_t(),2))
    .field('dng_levels', libraw_dng_levels_t())
    .field('WB_Coeffs', __typ.sizedArray(__typ.sizedArray(__typ.i32,4),256))
    .field('WBCT_Coeffs', __typ.sizedArray(__typ.sizedArray(__typ.f32,5),64))
    .field('as_shot_wb_applied', __typ.i32)
    .field('P1_color', __typ.sizedArray(libraw_P1_color_t(),2))
    .field('raw_bps', __typ.u32)
    .field('ExifColorSpace', __typ.i32)
}
export function libraw_thumbnail_t() {
  return new __typ.Struct()
    .field('tformat', LibRaw_thumbnail_formats())
    .field('twidth', ushort())
    .field('theight', ushort())
    .field('tlength', __typ.u32)
    .field('tcolors', __typ.i32)
    .field('thumb', __typ.ptr(__typ.u8))
}
export function libraw_thumbnail_item_t() {
  return new __typ.Struct()
    .field('tformat', LibRaw_internal_thumbnail_formats())
    .field('twidth', ushort())
    .field('theight', ushort())
    .field('tflip', ushort())
    .field('tlength', __typ.u32)
    .field('tmisc', __typ.u32)
    .field('toffset', INT64())
}
export function libraw_thumbnail_list_t() {
  return new __typ.Struct()
    .field('thumbcount', __typ.i32)
    .field('thumblist', __typ.sizedArray(libraw_thumbnail_item_t(),8))
}
export function libraw_gps_info_t() {
  return new __typ.Struct()
    .field('latitude', __typ.sizedArray(__typ.f32,3))
    .field('longitude', __typ.sizedArray(__typ.f32,3))
    .field('gpstimestamp', __typ.sizedArray(__typ.f32,3))
    .field('altitude', __typ.f32)
    .field('altref', __typ.u8)
    .field('latref', __typ.u8)
    .field('longref', __typ.u8)
    .field('gpsstatus', __typ.u8)
    .field('gpsparsed', __typ.u8)
}
export function libraw_imgother_t() {
  return new __typ.Struct()
    .field('iso_speed', __typ.f32)
    .field('shutter', __typ.f32)
    .field('aperture', __typ.f32)
    .field('focal_len', __typ.f32)
    .field('timestamp', time_t())
    .field('shot_order', __typ.u32)
    .field('gpsdata', __typ.sizedArray(__typ.u32,32))
    .field('parsed_gps', libraw_gps_info_t())
    .field('desc', __typ.sizedArray(__typ.u8,512))
    .field('artist', __typ.sizedArray(__typ.u8,64))
    .field('analogbalance', __typ.sizedArray(__typ.f32,4))
}
export function libraw_afinfo_item_t() {
  return new __typ.Struct()
    .field('AFInfoData_tag', __typ.u32)
    .field('AFInfoData_order', __typ.i16)
    .field('AFInfoData_version', __typ.u32)
    .field('AFInfoData_length', __typ.u32)
    .field('AFInfoData', __typ.ptr(uchar()))
}
export function libraw_metadata_common_t() {
  return new __typ.Struct()
    .field('FlashEC', __typ.f32)
    .field('FlashGN', __typ.f32)
    .field('CameraTemperature', __typ.f32)
    .field('SensorTemperature', __typ.f32)
    .field('SensorTemperature2', __typ.f32)
    .field('LensTemperature', __typ.f32)
    .field('AmbientTemperature', __typ.f32)
    .field('BatteryTemperature', __typ.f32)
    .field('exifAmbientTemperature', __typ.f32)
    .field('exifHumidity', __typ.f32)
    .field('exifPressure', __typ.f32)
    .field('exifWaterDepth', __typ.f32)
    .field('exifAcceleration', __typ.f32)
    .field('exifCameraElevationAngle', __typ.f32)
    .field('real_ISO', __typ.f32)
    .field('exifExposureIndex', __typ.f32)
    .field('ColorSpace', ushort())
    .field('firmware', __typ.sizedArray(__typ.u8,128))
    .field('ExposureCalibrationShift', __typ.f32)
    .field('afdata', __typ.sizedArray(libraw_afinfo_item_t(),4))
    .field('afcount', __typ.i32)
}
export function libraw_output_params_t() {
  return new __typ.Struct()
    .field('greybox', __typ.sizedArray(__typ.u32,4))
    .field('cropbox', __typ.sizedArray(__typ.u32,4))
    .field('aber', __typ.sizedArray(__typ.f64,4))
    .field('gamm', __typ.sizedArray(__typ.f64,6))
    .field('user_mul', __typ.sizedArray(__typ.f32,4))
    .field('bright', __typ.f32)
    .field('threshold', __typ.f32)
    .field('half_size', __typ.i32)
    .field('four_color_rgb', __typ.i32)
    .field('highlight', __typ.i32)
    .field('use_auto_wb', __typ.i32)
    .field('use_camera_wb', __typ.i32)
    .field('use_camera_matrix', __typ.i32)
    .field('output_color', __typ.i32)
    .field('output_profile', __typ.ptr(__typ.u8))
    .field('camera_profile', __typ.ptr(__typ.u8))
    .field('bad_pixels', __typ.ptr(__typ.u8))
    .field('dark_frame', __typ.ptr(__typ.u8))
    .field('output_bps', __typ.i32)
    .field('output_tiff', __typ.i32)
    .field('output_flags', __typ.i32)
    .field('user_flip', __typ.i32)
    .field('user_qual', __typ.i32)
    .field('user_black', __typ.i32)
    .field('user_cblack', __typ.sizedArray(__typ.i32,4))
    .field('user_sat', __typ.i32)
    .field('med_passes', __typ.i32)
    .field('auto_bright_thr', __typ.f32)
    .field('adjust_maximum_thr', __typ.f32)
    .field('no_auto_bright', __typ.i32)
    .field('use_fuji_rotate', __typ.i32)
    .field('use_p1_correction', __typ.i32)
    .field('green_matching', __typ.i32)
    .field('dcb_iterations', __typ.i32)
    .field('dcb_enhance_fl', __typ.i32)
    .field('fbdd_noiserd', __typ.i32)
    .field('exp_correc', __typ.i32)
    .field('exp_shift', __typ.f32)
    .field('exp_preser', __typ.f32)
    .field('no_auto_scale', __typ.i32)
    .field('no_interpolation', __typ.i32)
}
export function libraw_raw_unpack_params_t() {
  return new __typ.Struct()
    .field('use_rawspeed', __typ.i32)
    .field('use_dngsdk', __typ.i32)
    .field('options', __typ.u32)
    .field('shot_select', __typ.u32)
    .field('specials', __typ.u32)
    .field('max_raw_memory_mb', __typ.u32)
    .field('sony_arw2_posterization_thr', __typ.i32)
    .field('coolscan_nef_gamma', __typ.f32)
    .field('p4shot_order', __typ.sizedArray(__typ.u8,5))
    .field('custom_camera_strings', __typ.ptr(__typ.ptr(__typ.u8)))
}
export function libraw_rawdata_t() {
  return new __typ.Struct()
    .field('raw_alloc', __typ.ptr(__typ.u32))
    .field('raw_image', __typ.ptr(ushort()))
    .field('color4_image', __typ.ptr(__typ.sizedArray(ushort(),4)))
    .field('color3_image', __typ.ptr(__typ.sizedArray(ushort(),3)))
    .field('float_image', __typ.ptr(__typ.f32))
    .field('float3_image', __typ.ptr(__typ.sizedArray(__typ.f32,3)))
    .field('float4_image', __typ.ptr(__typ.sizedArray(__typ.f32,4)))
    .field('ph1_cblack', __typ.ptr(__typ.sizedArray(__typ.i16,2)))
    .field('ph1_rblack', __typ.ptr(__typ.sizedArray(__typ.i16,2)))
    .field('iparams', libraw_iparams_t())
    .field('sizes', libraw_image_sizes_t())
    .field('ioparams', libraw_internal_output_params_t())
    .field('color', libraw_colordata_t())
}
export function libraw_makernotes_lens_t() {
  return new __typ.Struct()
    .field('LensID', __typ.u64)
    .field('Lens', __typ.sizedArray(__typ.u8,128))
    .field('LensFormat', ushort())
    .field('LensMount', ushort())
    .field('CamID', __typ.u64)
    .field('CameraFormat', ushort())
    .field('CameraMount', ushort())
    .field('body', __typ.sizedArray(__typ.u8,64))
    .field('FocalType', __typ.i16)
    .field('LensFeatures_pre', __typ.sizedArray(__typ.u8,16))
    .field('LensFeatures_suf', __typ.sizedArray(__typ.u8,16))
    .field('MinFocal', __typ.f32)
    .field('MaxFocal', __typ.f32)
    .field('MaxAp4MinFocal', __typ.f32)
    .field('MaxAp4MaxFocal', __typ.f32)
    .field('MinAp4MinFocal', __typ.f32)
    .field('MinAp4MaxFocal', __typ.f32)
    .field('MaxAp', __typ.f32)
    .field('MinAp', __typ.f32)
    .field('CurFocal', __typ.f32)
    .field('CurAp', __typ.f32)
    .field('MaxAp4CurFocal', __typ.f32)
    .field('MinAp4CurFocal', __typ.f32)
    .field('MinFocusDistance', __typ.f32)
    .field('FocusRangeIndex', __typ.f32)
    .field('LensFStops', __typ.f32)
    .field('TeleconverterID', __typ.u64)
    .field('Teleconverter', __typ.sizedArray(__typ.u8,128))
    .field('AdapterID', __typ.u64)
    .field('Adapter', __typ.sizedArray(__typ.u8,128))
    .field('AttachmentID', __typ.u64)
    .field('Attachment', __typ.sizedArray(__typ.u8,128))
    .field('FocalUnits', ushort())
    .field('FocalLengthIn35mmFormat', __typ.f32)
}
export function libraw_nikonlens_t() {
  return new __typ.Struct()
    .field('EffectiveMaxAp', __typ.f32)
    .field('LensIDNumber', uchar())
    .field('LensFStops', uchar())
    .field('MCUVersion', uchar())
    .field('LensType', uchar())
}
export function libraw_dnglens_t() {
  return new __typ.Struct()
    .field('MinFocal', __typ.f32)
    .field('MaxFocal', __typ.f32)
    .field('MaxAp4MinFocal', __typ.f32)
    .field('MaxAp4MaxFocal', __typ.f32)
}
export function libraw_lensinfo_t() {
  return new __typ.Struct()
    .field('MinFocal', __typ.f32)
    .field('MaxFocal', __typ.f32)
    .field('MaxAp4MinFocal', __typ.f32)
    .field('MaxAp4MaxFocal', __typ.f32)
    .field('EXIF_MaxAp', __typ.f32)
    .field('LensMake', __typ.sizedArray(__typ.u8,128))
    .field('Lens', __typ.sizedArray(__typ.u8,128))
    .field('LensSerial', __typ.sizedArray(__typ.u8,128))
    .field('InternalLensSerial', __typ.sizedArray(__typ.u8,128))
    .field('FocalLengthIn35mmFormat', ushort())
    .field('nikon', libraw_nikonlens_t())
    .field('dng', libraw_dnglens_t())
    .field('makernotes', libraw_makernotes_lens_t())
}
export function libraw_makernotes_t() {
  return new __typ.Struct()
    .field('canon', libraw_canon_makernotes_t())
    .field('nikon', libraw_nikon_makernotes_t())
    .field('hasselblad', libraw_hasselblad_makernotes_t())
    .field('fuji', libraw_fuji_info_t())
    .field('olympus', libraw_olympus_makernotes_t())
    .field('sony', libraw_sony_info_t())
    .field('kodak', libraw_kodak_makernotes_t())
    .field('panasonic', libraw_panasonic_makernotes_t())
    .field('pentax', libraw_pentax_makernotes_t())
    .field('phaseone', libraw_p1_makernotes_t())
    .field('ricoh', libraw_ricoh_makernotes_t())
    .field('samsung', libraw_samsung_makernotes_t())
    .field('common', libraw_metadata_common_t())
}
export function libraw_shootinginfo_t() {
  return new __typ.Struct()
    .field('DriveMode', __typ.i16)
    .field('FocusMode', __typ.i16)
    .field('MeteringMode', __typ.i16)
    .field('AFPoint', __typ.i16)
    .field('ExposureMode', __typ.i16)
    .field('ExposureProgram', __typ.i16)
    .field('ImageStabilization', __typ.i16)
    .field('BodySerial', __typ.sizedArray(__typ.u8,64))
    .field('InternalBodySerial', __typ.sizedArray(__typ.u8,64))
}
export function libraw_custom_camera_t() {
  return new __typ.Struct()
    .field('fsize', __typ.u32)
    .field('rw', ushort())
    .field('rh', ushort())
    .field('lm', uchar())
    .field('tm', uchar())
    .field('rm', uchar())
    .field('bm', uchar())
    .field('lf', ushort())
    .field('cf', uchar())
    .field('max', uchar())
    .field('flags', uchar())
    .field('t_make', __typ.sizedArray(__typ.u8,10))
    .field('t_model', __typ.sizedArray(__typ.u8,20))
    .field('offset', ushort())
}
export function libraw_data_t() {
  return new __typ.Struct()
    .field('image', __typ.ptr(__typ.sizedArray(ushort(),4)))
    .field('sizes', libraw_image_sizes_t())
    .field('idata', libraw_iparams_t())
    .field('lens', libraw_lensinfo_t())
    .field('makernotes', libraw_makernotes_t())
    .field('shootinginfo', libraw_shootinginfo_t())
    .field('params', libraw_output_params_t())
    .field('rawparams', libraw_raw_unpack_params_t())
    .field('progress_flags', __typ.u32)
    .field('process_warnings', __typ.u32)
    .field('color', libraw_colordata_t())
    .field('other', libraw_imgother_t())
    .field('thumbnail', libraw_thumbnail_t())
    .field('thumbs_list', libraw_thumbnail_list_t())
    .field('rawdata', libraw_rawdata_t())
    .field('parent_class', __typ.ptr(__typ.u32))
}
export function fuji_q_table() {
  return new __typ.Struct()
    .field('q_table', __typ.ptr(__typ.i8))
    .field('raw_bits', __typ.i32)
    .field('total_values', __typ.i32)
    .field('max_grad', __typ.i32)
    .field('q_grad_mult', __typ.i32)
    .field('q_base', __typ.i32)
}
export function fuji_compressed_params() {
  return new __typ.Struct()
    .field('qt', __typ.sizedArray(fuji_q_table(),4))
    .field('buf', __typ.ptr(__typ.u32))
    .field('max_bits', __typ.i32)
    .field('min_value', __typ.i32)
    .field('max_value', __typ.i32)
    .field('line_width', ushort())
}
export function output_data_t() {
  return new __typ.Struct()
    .field('histogram', __typ.ptr(__typ.sizedArray(__typ.i32,8192)))
    .field('oprof', __typ.ptr(__typ.u32))
}
export function identify_data_t() {
  return new __typ.Struct()
    .field('olympus_exif_cfa', __typ.u32)
    .field('unique_id', __typ.u64)
    .field('OlyID', __typ.u64)
    .field('tiff_nifds', __typ.u32)
    .field('tiff_flip', __typ.i32)
    .field('metadata_blocks', __typ.i32)
}
export function crx_sample_to_chunk_t() {
  return new __typ.Struct()
    .field('first', __typ.u32)
    .field('count', __typ.u32)
    .field('id', __typ.u32)
}
export function crx_data_header_t() {
  return new __typ.Struct()
    .field('version', __typ.i32)
    .field('f_width', __typ.i32)
    .field('f_height', __typ.i32)
    .field('tileWidth', __typ.i32)
    .field('tileHeight', __typ.i32)
    .field('nBits', __typ.i32)
    .field('nPlanes', __typ.i32)
    .field('cfaLayout', __typ.i32)
    .field('encType', __typ.i32)
    .field('imageLevels', __typ.i32)
    .field('hasTileCols', __typ.i32)
    .field('hasTileRows', __typ.i32)
    .field('mdatHdrSize', __typ.i32)
    .field('medianBits', __typ.i32)
    .field('MediaSize', __typ.u32)
    .field('MediaOffset', INT64())
    .field('MediaType', __typ.u32)
    .field('stsc_data', __typ.ptr(crx_sample_to_chunk_t()))
    .field('stsc_count', __typ.u32)
    .field('sample_count', __typ.u32)
    .field('sample_size', __typ.u32)
    .field('sample_sizes', __typ.ptr(__typ.i32))
    .field('chunk_count', __typ.u32)
    .field('chunk_offsets', __typ.ptr(INT64()))
}
export function pana8_tags_t() {
  return new __typ.Struct()
    .field('tag39', __typ.sizedArray(__typ.u32,6))
    .field('tag3A', __typ.sizedArray(__typ.u16,6))
    .field('tag3B', __typ.u16)
    .field('initial', __typ.sizedArray(__typ.u16,4))
    .field('tag40a', __typ.sizedArray(__typ.u16,17))
    .field('tag40b', __typ.sizedArray(__typ.u16,17))
    .field('tag41', __typ.sizedArray(__typ.u16,17))
    .field('stripe_count', __typ.u16)
    .field('tag43', __typ.u16)
    .field('stripe_offsets', __typ.sizedArray(INT64(),5))
    .field('stripe_left', __typ.sizedArray(__typ.u16,5))
    .field('stripe_compressed_size', __typ.sizedArray(__typ.u32,5))
    .field('stripe_width', __typ.sizedArray(__typ.u16,5))
    .field('stripe_height', __typ.sizedArray(__typ.u16,5))
}
export function unpacker_data_t() {
  return new __typ.Struct()
    .field('order', __typ.i16)
    .field('sraw_mul', __typ.sizedArray(ushort(),4))
    .field('cr2_slice', __typ.sizedArray(ushort(),3))
    .field('kodak_cbpp', __typ.u32)
    .field('strip_offset', INT64())
    .field('data_offset', INT64())
    .field('meta_offset', INT64())
    .field('exif_offset', INT64())
    .field('exif_subdir_offset', INT64())
    .field('ifd0_offset', INT64())
    .field('data_size', __typ.u32)
    .field('meta_length', __typ.u32)
    .field('cr3_exif_length', __typ.u32)
    .field('cr3_ifd0_length', __typ.u32)
    .field('thumb_misc', __typ.u32)
    .field('thumb_format', LibRaw_internal_thumbnail_formats())
    .field('fuji_layout', __typ.u32)
    .field('tiff_samples', __typ.u32)
    .field('tiff_bps', __typ.u32)
    .field('tiff_compress', __typ.u32)
    .field('tiff_sampleformat', __typ.u32)
    .field('zero_after_ff', __typ.u32)
    .field('tile_width', __typ.u32)
    .field('tile_length', __typ.u32)
    .field('load_flags', __typ.u32)
    .field('data_error', __typ.u32)
    .field('hasselblad_parser_flag', __typ.i32)
    .field('posRAFData', __typ.i64)
    .field('lenRAFData', __typ.u32)
    .field('fuji_total_lines', __typ.i32)
    .field('fuji_total_blocks', __typ.i32)
    .field('fuji_block_width', __typ.i32)
    .field('fuji_bits', __typ.i32)
    .field('fuji_raw_type', __typ.i32)
    .field('fuji_lossless', __typ.i32)
    .field('pana_encoding', __typ.i32)
    .field('pana_bpp', __typ.i32)
    .field('pana8', pana8_tags_t())
    .field('crx_header', __typ.sizedArray(crx_data_header_t(),16))
    .field('crx_track_selected', __typ.i32)
    .field('crx_track_count', __typ.i32)
    .field('CR3_CTMDtag', __typ.i16)
    .field('CR3_Version', __typ.i16)
    .field('CM_found', __typ.i32)
    .field('is_NikonTransfer', __typ.u32)
    .field('is_Olympus', __typ.u32)
    .field('OlympusDNG_SubDirOffsetValid', __typ.i32)
    .field('is_Sony', __typ.u32)
    .field('is_pana_raw', __typ.u32)
    .field('is_PentaxRicohMakernotes', __typ.u32)
    .field('dng_frames', __typ.sizedArray(__typ.u32,20))
    .field('raw_stride', __typ.u16)
}
export function tiff_ifd_t() {
  return new __typ.Struct()
    .field('t_width', __typ.i32)
    .field('t_height', __typ.i32)
    .field('bps', __typ.i32)
    .field('comp', __typ.i32)
    .field('phint', __typ.i32)
    .field('offset', __typ.i32)
    .field('t_flip', __typ.i32)
    .field('samples', __typ.i32)
    .field('bytes', __typ.i32)
    .field('extrasamples', __typ.i32)
    .field('t_tile_width', __typ.i32)
    .field('t_tile_length', __typ.i32)
    .field('sample_format', __typ.i32)
    .field('predictor', __typ.i32)
    .field('rows_per_strip', __typ.i32)
    .field('strip_offsets', __typ.ptr(__typ.i32))
    .field('strip_offsets_count', __typ.i32)
    .field('strip_byte_counts', __typ.ptr(__typ.i32))
    .field('strip_byte_counts_count', __typ.i32)
    .field('t_filters', __typ.u32)
    .field('t_vwidth', __typ.i32)
    .field('t_vheight', __typ.i32)
    .field('t_lm', __typ.i32)
    .field('t_tm', __typ.i32)
    .field('t_fuji_width', __typ.i32)
    .field('t_shutter', __typ.f32)
    .field('opcode2_offset', INT64())
    .field('lineartable_offset', INT64())
    .field('lineartable_len', __typ.i32)
    .field('dng_color', __typ.sizedArray(libraw_dng_color_t(),2))
    .field('dng_levels', libraw_dng_levels_t())
    .field('newsubfiletype', __typ.i32)
}
export function jhead() {
  return new __typ.Struct()
    .field('algo', __typ.i32)
    .field('bits', __typ.i32)
    .field('high', __typ.i32)
    .field('wide', __typ.i32)
    .field('clrs', __typ.i32)
    .field('sraw', __typ.i32)
    .field('psv', __typ.i32)
    .field('restart', __typ.i32)
    .field('vpred', __typ.sizedArray(__typ.i32,6))
    .field('quant', __typ.sizedArray(ushort(),64))
    .field('idct', __typ.sizedArray(ushort(),64))
    .field('huff', __typ.sizedArray(__typ.ptr(ushort()),20))
    .field('free', __typ.sizedArray(__typ.ptr(ushort()),20))
    .field('row', __typ.ptr(ushort()))
}
export function __locale_data() {
  return new __typ.Struct()
    .field('_address', __typ.u8)
}
export function LibRaw_abstract_datastream() {
  return new __typ.Struct()
    .field('_address', __typ.u8)
}
export function LIBRAW_SONY_FOCUSMODEmodes() {
  return __typ.enumLike(__typ.i32, {
    LIBRAW_SONY_FOCUSMODE_AF: 101,
    LIBRAW_SONY_FOCUSMODE_AF_A: 4,
    LIBRAW_SONY_FOCUSMODE_AF_C: 3,
    LIBRAW_SONY_FOCUSMODE_AF_D: 7,
    LIBRAW_SONY_FOCUSMODE_AF_S: 2,
    LIBRAW_SONY_FOCUSMODE_DMF: 6,
    LIBRAW_SONY_FOCUSMODE_MF: 0,
    LIBRAW_SONY_FOCUSMODE_PERMANENT_AF: 104,
    LIBRAW_SONY_FOCUSMODE_SEMI_MF: 105,
    LIBRAW_SONY_FOCUSMODE_UNKNOWN: -1,
  })
}
export function LibRawImageAspects() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_IMAGE_ASPECT_16to9: 1777,
    LIBRAW_IMAGE_ASPECT_1to1: 1000,
    LIBRAW_IMAGE_ASPECT_3to2: 1500,
    LIBRAW_IMAGE_ASPECT_4to3: 1333,
    LIBRAW_IMAGE_ASPECT_5to4: 1250,
    LIBRAW_IMAGE_ASPECT_6to5: 1200,
    LIBRAW_IMAGE_ASPECT_7to5: 1400,
    LIBRAW_IMAGE_ASPECT_7to6: 1166,
    LIBRAW_IMAGE_ASPECT_MAXIMAL_REAL_ASPECT_VALUE: 10000,
    LIBRAW_IMAGE_ASPECT_MINIMAL_REAL_ASPECT_VALUE: 99,
    LIBRAW_IMAGE_ASPECT_OTHER: 1,
    LIBRAW_IMAGE_ASPECT_UNKNOWN: 0,
  })
}
export function LibRaw_As_Shot_WB_Applied_codes() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_ASWB_APPLIED: 1,
    LIBRAW_ASWB_CANON: 2,
    LIBRAW_ASWB_NIKON: 4,
    LIBRAW_ASWB_NIKON_SRAW: 8,
    LIBRAW_ASWB_PENTAX: 16,
    LIBRAW_ASWB_SONY: 32,
  })
}
export function LibRaw_Canon_RecordModes() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_Canon_RecordMode_AVI_THM: 3,
    LIBRAW_Canon_RecordMode_CR2: 6,
    LIBRAW_Canon_RecordMode_CR2_JPEG: 7,
    LIBRAW_Canon_RecordMode_CR3: 12,
    LIBRAW_Canon_RecordMode_CR3_HEIF: 15,
    LIBRAW_Canon_RecordMode_CR3_JPEG: 13,
    LIBRAW_Canon_RecordMode_CRM: 11,
    LIBRAW_Canon_RecordMode_CRW_THM: 2,
    LIBRAW_Canon_RecordMode_HEIF: 14,
    LIBRAW_Canon_RecordMode_JPEG: 1,
    LIBRAW_Canon_RecordMode_MOV: 9,
    LIBRAW_Canon_RecordMode_MP4: 10,
    LIBRAW_Canon_RecordMode_TIF: 4,
    LIBRAW_Canon_RecordMode_TIF_JPEG: 5,
    LIBRAW_Canon_RecordMode_TheLastOne: 16,
    LIBRAW_Canon_RecordMode_UNDEFINED: 0,
    LIBRAW_Canon_RecordMode_UNKNOWN: 8,
  })
}
export function LibRaw_ExifTagTypes() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_EXIFTAG_TYPE_ASCII: 2,
    LIBRAW_EXIFTAG_TYPE_BYTE: 1,
    LIBRAW_EXIFTAG_TYPE_COMPLEX: 15,
    LIBRAW_EXIFTAG_TYPE_DOUBLE: 12,
    LIBRAW_EXIFTAG_TYPE_FLOAT: 11,
    LIBRAW_EXIFTAG_TYPE_IFD: 13,
    LIBRAW_EXIFTAG_TYPE_IFD8: 18,
    LIBRAW_EXIFTAG_TYPE_LONG: 4,
    LIBRAW_EXIFTAG_TYPE_LONG8: 16,
    LIBRAW_EXIFTAG_TYPE_RATIONAL: 5,
    LIBRAW_EXIFTAG_TYPE_SBYTE: 6,
    LIBRAW_EXIFTAG_TYPE_SHORT: 3,
    LIBRAW_EXIFTAG_TYPE_SLONG: 9,
    LIBRAW_EXIFTAG_TYPE_SLONG8: 17,
    LIBRAW_EXIFTAG_TYPE_SRATIONAL: 10,
    LIBRAW_EXIFTAG_TYPE_SSHORT: 8,
    LIBRAW_EXIFTAG_TYPE_UNDEFINED: 7,
    LIBRAW_EXIFTAG_TYPE_UNICODE: 14,
    LIBRAW_EXIFTAG_TYPE_UNKNOWN: 0,
  })
}
export function LibRaw_HasselbladFormatCodes() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_HF_3FR: 1,
    LIBRAW_HF_AdobeDNG: 5,
    LIBRAW_HF_AdobeDNG_fromPhocusDNG: 6,
    LIBRAW_HF_FFF: 2,
    LIBRAW_HF_HasselbladDNG: 4,
    LIBRAW_HF_Imacon: 3,
    LIBRAW_HF_Unknown: 0,
  })
}
export function LibRaw_KodakSensors() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_Kodak_C14: 11,
    LIBRAW_Kodak_M1: 1,
    LIBRAW_Kodak_M11: 13,
    LIBRAW_Kodak_M15: 2,
    LIBRAW_Kodak_M16: 3,
    LIBRAW_Kodak_M17: 4,
    LIBRAW_Kodak_M2: 5,
    LIBRAW_Kodak_M23: 6,
    LIBRAW_Kodak_M24: 7,
    LIBRAW_Kodak_M3: 8,
    LIBRAW_Kodak_M5: 9,
    LIBRAW_Kodak_M6: 10,
    LIBRAW_Kodak_UnknownSensor: 0,
    LIBRAW_Kodak_X14: 12,
  })
}
export function LibRaw_MultiExposure_related() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_ME_HDR: 3,
    LIBRAW_ME_NONE: 0,
    LIBRAW_ME_OVERLAY: 2,
    LIBRAW_ME_SIMPLE: 1,
  })
}
export function LibRaw_Sony_0x2010_Type() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_SONY_Tag2010None: 0,
    LIBRAW_SONY_Tag2010a: 1,
    LIBRAW_SONY_Tag2010b: 2,
    LIBRAW_SONY_Tag2010c: 3,
    LIBRAW_SONY_Tag2010d: 4,
    LIBRAW_SONY_Tag2010e: 5,
    LIBRAW_SONY_Tag2010f: 6,
    LIBRAW_SONY_Tag2010g: 7,
    LIBRAW_SONY_Tag2010h: 8,
    LIBRAW_SONY_Tag2010i: 9,
  })
}
export function LibRaw_Sony_0x9050_Type() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_SONY_Tag9050None: 0,
    LIBRAW_SONY_Tag9050a: 1,
    LIBRAW_SONY_Tag9050b: 2,
    LIBRAW_SONY_Tag9050c: 3,
    LIBRAW_SONY_Tag9050d: 4,
  })
}
export function LibRaw_camera_formats() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_FORMAT_1INCH: 5,
    LIBRAW_FORMAT_1div1p7INCH: 7,
    LIBRAW_FORMAT_1div2p3INCH: 6,
    LIBRAW_FORMAT_3648: 20,
    LIBRAW_FORMAT_645: 11,
    LIBRAW_FORMAT_66: 12,
    LIBRAW_FORMAT_67: 16,
    LIBRAW_FORMAT_68: 21,
    LIBRAW_FORMAT_69: 13,
    LIBRAW_FORMAT_APSC: 1,
    LIBRAW_FORMAT_APSH: 4,
    LIBRAW_FORMAT_CROP645: 9,
    LIBRAW_FORMAT_FF: 2,
    LIBRAW_FORMAT_FT: 8,
    LIBRAW_FORMAT_LF: 14,
    LIBRAW_FORMAT_LeicaS: 10,
    LIBRAW_FORMAT_Leica_DMR: 15,
    LIBRAW_FORMAT_MF: 3,
    LIBRAW_FORMAT_SigmaAPSC: 17,
    LIBRAW_FORMAT_SigmaAPSH: 19,
    LIBRAW_FORMAT_SigmaMerrill: 18,
    LIBRAW_FORMAT_TheLastOne: 22,
    LIBRAW_FORMAT_Unknown: 0,
  })
}
export function LibRaw_camera_mounts() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_MOUNT_Alpa: 1,
    LIBRAW_MOUNT_C: 2,
    LIBRAW_MOUNT_Canon_EF: 5,
    LIBRAW_MOUNT_Canon_EF_M: 3,
    LIBRAW_MOUNT_Canon_EF_S: 4,
    LIBRAW_MOUNT_Canon_RF: 6,
    LIBRAW_MOUNT_Contax645: 8,
    LIBRAW_MOUNT_Contax_N: 7,
    LIBRAW_MOUNT_DigitalBack: 42,
    LIBRAW_MOUNT_FT: 9,
    LIBRAW_MOUNT_FixedLens: 43,
    LIBRAW_MOUNT_Fuji_GF: 11,
    LIBRAW_MOUNT_Fuji_GX: 12,
    LIBRAW_MOUNT_Fuji_X: 13,
    LIBRAW_MOUNT_Hasselblad_H: 14,
    LIBRAW_MOUNT_Hasselblad_V: 15,
    LIBRAW_MOUNT_Hasselblad_XCD: 16,
    LIBRAW_MOUNT_IL_UM: 44,
    LIBRAW_MOUNT_LF: 41,
    LIBRAW_MOUNT_LPS_L: 22,
    LIBRAW_MOUNT_Leica_M: 17,
    LIBRAW_MOUNT_Leica_R: 18,
    LIBRAW_MOUNT_Leica_S: 19,
    LIBRAW_MOUNT_Leica_SL: 20,
    LIBRAW_MOUNT_Leica_TL: 21,
    LIBRAW_MOUNT_Mamiya645: 24,
    LIBRAW_MOUNT_Mamiya67: 23,
    LIBRAW_MOUNT_Minolta_A: 25,
    LIBRAW_MOUNT_Nikon_CX: 26,
    LIBRAW_MOUNT_Nikon_F: 27,
    LIBRAW_MOUNT_Nikon_Z: 28,
    LIBRAW_MOUNT_Pentax_645: 32,
    LIBRAW_MOUNT_Pentax_K: 33,
    LIBRAW_MOUNT_Pentax_Q: 34,
    LIBRAW_MOUNT_PhaseOne_iXM: 31,
    LIBRAW_MOUNT_PhaseOne_iXM_MV: 29,
    LIBRAW_MOUNT_PhaseOne_iXM_RS: 30,
    LIBRAW_MOUNT_RicohModule: 35,
    LIBRAW_MOUNT_Rollei_bayonet: 36,
    LIBRAW_MOUNT_Samsung_NX: 38,
    LIBRAW_MOUNT_Samsung_NX_M: 37,
    LIBRAW_MOUNT_Sigma_X3F: 39,
    LIBRAW_MOUNT_Sony_E: 40,
    LIBRAW_MOUNT_TheLastOne: 45,
    LIBRAW_MOUNT_Unknown: 0,
    LIBRAW_MOUNT_mFT: 10,
  })
}
export function LibRaw_cameramaker_index() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_CAMERAMAKER_AVT: 5,
    LIBRAW_CAMERAMAKER_Agfa: 1,
    LIBRAW_CAMERAMAKER_Alcatel: 2,
    LIBRAW_CAMERAMAKER_Apple: 3,
    LIBRAW_CAMERAMAKER_Aptina: 4,
    LIBRAW_CAMERAMAKER_Baumer: 6,
    LIBRAW_CAMERAMAKER_Broadcom: 7,
    LIBRAW_CAMERAMAKER_CINE: 10,
    LIBRAW_CAMERAMAKER_Canon: 8,
    LIBRAW_CAMERAMAKER_Casio: 9,
    LIBRAW_CAMERAMAKER_Clauss: 11,
    LIBRAW_CAMERAMAKER_Contax: 12,
    LIBRAW_CAMERAMAKER_Creative: 13,
    LIBRAW_CAMERAMAKER_DJI: 14,
    LIBRAW_CAMERAMAKER_DXO: 15,
    LIBRAW_CAMERAMAKER_Epson: 16,
    LIBRAW_CAMERAMAKER_Foculus: 17,
    LIBRAW_CAMERAMAKER_Fujifilm: 18,
    LIBRAW_CAMERAMAKER_GITUP: 21,
    LIBRAW_CAMERAMAKER_Generic: 19,
    LIBRAW_CAMERAMAKER_Gione: 20,
    LIBRAW_CAMERAMAKER_GoPro: 23,
    LIBRAW_CAMERAMAKER_Google: 22,
    LIBRAW_CAMERAMAKER_HMD_Global: 75,
    LIBRAW_CAMERAMAKER_HTC: 25,
    LIBRAW_CAMERAMAKER_HUAWEI: 76,
    LIBRAW_CAMERAMAKER_Hasselblad: 24,
    LIBRAW_CAMERAMAKER_ISG: 73,
    LIBRAW_CAMERAMAKER_I_Mobile: 26,
    LIBRAW_CAMERAMAKER_Imacon: 27,
    LIBRAW_CAMERAMAKER_JK_Imaging: 28,
    LIBRAW_CAMERAMAKER_Kodak: 29,
    LIBRAW_CAMERAMAKER_Konica: 30,
    LIBRAW_CAMERAMAKER_LG: 34,
    LIBRAW_CAMERAMAKER_Leaf: 31,
    LIBRAW_CAMERAMAKER_Leica: 32,
    LIBRAW_CAMERAMAKER_Lenovo: 33,
    LIBRAW_CAMERAMAKER_Logitech: 35,
    LIBRAW_CAMERAMAKER_Mamiya: 36,
    LIBRAW_CAMERAMAKER_Matrix: 37,
    LIBRAW_CAMERAMAKER_Meizu: 38,
    LIBRAW_CAMERAMAKER_Micron: 39,
    LIBRAW_CAMERAMAKER_Minolta: 40,
    LIBRAW_CAMERAMAKER_Motorola: 41,
    LIBRAW_CAMERAMAKER_NGM: 42,
    LIBRAW_CAMERAMAKER_Nikon: 43,
    LIBRAW_CAMERAMAKER_Nokia: 44,
    LIBRAW_CAMERAMAKER_Olympus: 45,
    LIBRAW_CAMERAMAKER_OmDigital: 78,
    LIBRAW_CAMERAMAKER_OmniVison: 46,
    LIBRAW_CAMERAMAKER_OnePlus: 72,
    LIBRAW_CAMERAMAKER_Panasonic: 47,
    LIBRAW_CAMERAMAKER_Parrot: 48,
    LIBRAW_CAMERAMAKER_Pentax: 49,
    LIBRAW_CAMERAMAKER_PhaseOne: 50,
    LIBRAW_CAMERAMAKER_PhotoControl: 51,
    LIBRAW_CAMERAMAKER_Photron: 52,
    LIBRAW_CAMERAMAKER_Pixelink: 53,
    LIBRAW_CAMERAMAKER_Polaroid: 54,
    LIBRAW_CAMERAMAKER_RED: 55,
    LIBRAW_CAMERAMAKER_RaspberryPi: 77,
    LIBRAW_CAMERAMAKER_Ricoh: 56,
    LIBRAW_CAMERAMAKER_Rollei: 57,
    LIBRAW_CAMERAMAKER_RoverShot: 58,
    LIBRAW_CAMERAMAKER_SMaL: 62,
    LIBRAW_CAMERAMAKER_ST_Micro: 64,
    LIBRAW_CAMERAMAKER_Samsung: 59,
    LIBRAW_CAMERAMAKER_Sigma: 60,
    LIBRAW_CAMERAMAKER_Sinar: 61,
    LIBRAW_CAMERAMAKER_Sony: 63,
    LIBRAW_CAMERAMAKER_THL: 65,
    LIBRAW_CAMERAMAKER_TheLastOne: 79,
    LIBRAW_CAMERAMAKER_Unknown: 0,
    LIBRAW_CAMERAMAKER_VIVO: 74,
    LIBRAW_CAMERAMAKER_VLUU: 66,
    LIBRAW_CAMERAMAKER_XIAOYI: 68,
    LIBRAW_CAMERAMAKER_Xiaomi: 67,
    LIBRAW_CAMERAMAKER_YI: 69,
    LIBRAW_CAMERAMAKER_Yuneec: 70,
    LIBRAW_CAMERAMAKER_Zeiss: 71,
  })
}
export function LibRaw_colorspace() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_COLORSPACE_AdobeRGB: 2,
    LIBRAW_COLORSPACE_CameraGamma: 10,
    LIBRAW_COLORSPACE_CameraGammaUniWB: 9,
    LIBRAW_COLORSPACE_CameraLinear: 8,
    LIBRAW_COLORSPACE_CameraLinearUniWB: 7,
    LIBRAW_COLORSPACE_ICC: 5,
    LIBRAW_COLORSPACE_MonochromeGamma: 12,
    LIBRAW_COLORSPACE_MonochromeLinear: 11,
    LIBRAW_COLORSPACE_NotFound: 0,
    LIBRAW_COLORSPACE_ProPhotoRGB: 4,
    LIBRAW_COLORSPACE_Rec2020: 13,
    LIBRAW_COLORSPACE_Uncalibrated: 6,
    LIBRAW_COLORSPACE_Unknown: 255,
    LIBRAW_COLORSPACE_WideGamutRGB: 3,
    LIBRAW_COLORSPACE_sRGB: 1,
  })
}
export function LibRaw_constructor_flags() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_OPIONS_NO_DATAERR_CALLBACK: 2,
    LIBRAW_OPTIONS_NONE: 0,
    LIBRAW_OPTIONS_NO_DATAERR_CALLBACK: 2,
  })
}
export function LibRaw_decoder_flags() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_DECODER_3CHANNEL: 2048,
    LIBRAW_DECODER_ADOBECOPYPIXEL: 512,
    LIBRAW_DECODER_FIXEDMAXC: 256,
    LIBRAW_DECODER_FLATDATA: 4096,
    LIBRAW_DECODER_FLAT_BG2_SWAPPED: 8192,
    LIBRAW_DECODER_HASCURVE: 16,
    LIBRAW_DECODER_LEGACY_WITH_MARGINS: 1024,
    LIBRAW_DECODER_NOTSET: 32768,
    LIBRAW_DECODER_OWNALLOC: 128,
    LIBRAW_DECODER_SINAR4SHOT: 2048,
    LIBRAW_DECODER_SONYARW2: 32,
    LIBRAW_DECODER_TRYRAWSPEED: 64,
    LIBRAW_DECODER_TRYRAWSPEED3: 65536,
    LIBRAW_DECODER_UNSUPPORTED_FORMAT: 16384,
  })
}
export function LibRaw_dng_processing() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_DNG_8BIT: 32,
    LIBRAW_DNG_ALL: 63,
    LIBRAW_DNG_DEFAULT: 39,
    LIBRAW_DNG_DEFLATE: 4,
    LIBRAW_DNG_FLOAT: 1,
    LIBRAW_DNG_LINEAR: 2,
    LIBRAW_DNG_NONE: 0,
    LIBRAW_DNG_OTHER: 16,
    LIBRAW_DNG_XTRANS: 8,
  })
}
export function LibRaw_dngfields_marks() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_DNGFM_ANALOGBALANCE: 16,
    LIBRAW_DNGFM_ASSHOTNEUTRAL: 4096,
    LIBRAW_DNGFM_BASELINEEXPOSURE: 8192,
    LIBRAW_DNGFM_BLACK: 32,
    LIBRAW_DNGFM_CALIBRATION: 8,
    LIBRAW_DNGFM_COLORMATRIX: 4,
    LIBRAW_DNGFM_CROPORIGIN: 512,
    LIBRAW_DNGFM_CROPSIZE: 1024,
    LIBRAW_DNGFM_FORWARDMATRIX: 1,
    LIBRAW_DNGFM_ILLUMINANT: 2,
    LIBRAW_DNGFM_LINEARRESPONSELIMIT: 16384,
    LIBRAW_DNGFM_LINTABLE: 256,
    LIBRAW_DNGFM_OPCODE1: 65536,
    LIBRAW_DNGFM_OPCODE2: 128,
    LIBRAW_DNGFM_OPCODE3: 131072,
    LIBRAW_DNGFM_PREVIEWCS: 2048,
    LIBRAW_DNGFM_USERCROP: 32768,
    LIBRAW_DNGFM_WHITE: 64,
  })
}
export function LibRaw_errors() {
  return __typ.enumLike(__typ.i32, {
    LIBRAW_BAD_CROP: -100011,
    LIBRAW_CANCELLED_BY_CALLBACK: -100010,
    LIBRAW_DATA_ERROR: -100008,
    LIBRAW_FILE_UNSUPPORTED: -2,
    LIBRAW_INPUT_CLOSED: -7,
    LIBRAW_IO_ERROR: -100009,
    LIBRAW_MEMPOOL_OVERFLOW: -100013,
    LIBRAW_NOT_IMPLEMENTED: -8,
    LIBRAW_NO_THUMBNAIL: -5,
    LIBRAW_OUT_OF_ORDER_CALL: -4,
    LIBRAW_REQUEST_FOR_NONEXISTENT_IMAGE: -3,
    LIBRAW_REQUEST_FOR_NONEXISTENT_THUMBNAIL: -9,
    LIBRAW_SUCCESS: 0,
    LIBRAW_TOO_BIG: -100012,
    LIBRAW_UNSPECIFIED_ERROR: -1,
    LIBRAW_UNSUFFICIENT_MEMORY: -100007,
    LIBRAW_UNSUPPORTED_THUMBNAIL: -6,
  })
}
export function LibRaw_exceptions() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_EXCEPTION_ALLOC: 1,
    LIBRAW_EXCEPTION_BAD_CROP: 7,
    LIBRAW_EXCEPTION_CANCELLED_BY_CALLBACK: 6,
    LIBRAW_EXCEPTION_DECODE_JPEG: 3,
    LIBRAW_EXCEPTION_DECODE_JPEG2000: 9,
    LIBRAW_EXCEPTION_DECODE_RAW: 2,
    LIBRAW_EXCEPTION_IO_BADFILE: 8,
    LIBRAW_EXCEPTION_IO_CORRUPT: 5,
    LIBRAW_EXCEPTION_IO_EOF: 4,
    LIBRAW_EXCEPTION_MEMPOOL: 11,
    LIBRAW_EXCEPTION_NONE: 0,
    LIBRAW_EXCEPTION_TOOBIG: 10,
    LIBRAW_EXCEPTION_UNSUPPORTED_FORMAT: 12,
  })
}
export function LibRaw_image_formats() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_IMAGE_BITMAP: 2,
    LIBRAW_IMAGE_JPEG: 1,
  })
}
export function LibRaw_internal_thumbnail_formats() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_INTERNAL_THUMBNAIL_DNG_YCBCR: 10,
    LIBRAW_INTERNAL_THUMBNAIL_JPEG: 4,
    LIBRAW_INTERNAL_THUMBNAIL_JPEGXL: 11,
    LIBRAW_INTERNAL_THUMBNAIL_KODAK_RGB: 3,
    LIBRAW_INTERNAL_THUMBNAIL_KODAK_THUMB: 1,
    LIBRAW_INTERNAL_THUMBNAIL_KODAK_YCBCR: 2,
    LIBRAW_INTERNAL_THUMBNAIL_LAYER: 5,
    LIBRAW_INTERNAL_THUMBNAIL_PPM: 7,
    LIBRAW_INTERNAL_THUMBNAIL_PPM16: 8,
    LIBRAW_INTERNAL_THUMBNAIL_ROLLEI: 6,
    LIBRAW_INTERNAL_THUMBNAIL_UNKNOWN: 0,
    LIBRAW_INTERNAL_THUMBNAIL_X3F: 9,
  })
}
export function LibRaw_lens_focal_types() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_FT_PRIME_LENS: 1,
    LIBRAW_FT_UNDEFINED: 0,
    LIBRAW_FT_ZOOM_LENS: 2,
    LIBRAW_FT_ZOOM_LENS_CONSTANT_APERTURE: 3,
    LIBRAW_FT_ZOOM_LENS_VARIABLE_APERTURE: 4,
  })
}
export function LibRaw_minolta_bayerpatterns() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_MINOLTA_G2BRG1: 4,
    LIBRAW_MINOLTA_RGGB: 1,
  })
}
export function LibRaw_minolta_storagemethods() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_MINOLTA_PACKED: 89,
    LIBRAW_MINOLTA_UNPACKED: 82,
  })
}
export function LibRaw_openbayer_patterns() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_OPENBAYER_BGGR: 22,
    LIBRAW_OPENBAYER_GBRG: 73,
    LIBRAW_OPENBAYER_GRBG: 97,
    LIBRAW_OPENBAYER_RGGB: 148,
  })
}
export function LibRaw_output_flags() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_OUTPUT_FLAGS_NONE: 0,
    LIBRAW_OUTPUT_FLAGS_PPMMETA: 1,
  })
}
export function LibRaw_processing_options() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_RAWOPTIONS_ALLOW_JPEGXL_PREVIEWS: 16777216,
    LIBRAW_RAWOPTIONS_ARQ_SKIP_CHANNEL_SWAP: 4,
    LIBRAW_RAWOPTIONS_CAMERAWB_FALLBACK_TO_DAYLIGHT: 131072,
    LIBRAW_RAWOPTIONS_CANON_IGNORE_MAKERNOTES_ROTATION: 8388608,
    LIBRAW_RAWOPTIONS_CHECK_THUMBNAILS_ALL_VENDORS: 524288,
    LIBRAW_RAWOPTIONS_CHECK_THUMBNAILS_KNOWN_VENDORS: 262144,
    LIBRAW_RAWOPTIONS_CONVERTFLOAT_TO_INT: 2,
    LIBRAW_RAWOPTIONS_DNGSDK_ZEROCOPY: 128,
    LIBRAW_RAWOPTIONS_DNG_ADD_ENHANCED: 512,
    LIBRAW_RAWOPTIONS_DNG_ADD_MASKS: 4194304,
    LIBRAW_RAWOPTIONS_DNG_ADD_PREVIEWS: 1024,
    LIBRAW_RAWOPTIONS_DNG_ALLOWSIZECHANGE: 16384,
    LIBRAW_RAWOPTIONS_DNG_DISABLEWBADJUST: 32768,
    LIBRAW_RAWOPTIONS_DNG_PREFER_LARGEST_IMAGE: 2048,
    LIBRAW_RAWOPTIONS_DNG_STAGE2: 4096,
    LIBRAW_RAWOPTIONS_DNG_STAGE2_IFPRESENT: 1048576,
    LIBRAW_RAWOPTIONS_DNG_STAGE3: 8192,
    LIBRAW_RAWOPTIONS_DNG_STAGE3_IFPRESENT: 2097152,
    LIBRAW_RAWOPTIONS_DONT_CHECK_DNG_ILLUMINANT: 64,
    LIBRAW_RAWOPTIONS_NO_ROTATE_FOR_KODAK_THUMBNAILS: 8,
    LIBRAW_RAWOPTIONS_PENTAX_PS_ALLFRAMES: 1,
    LIBRAW_RAWOPTIONS_PROVIDE_NONSTANDARD_WB: 65536,
    LIBRAW_RAWOPTIONS_USE_PPM16_THUMBS: 32,
    LIBRAW_RAWOPTIONS_ZEROFILTERS_FOR_MONOCHROMETIFFS: 256,
  })
}
export function LibRaw_progress() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_PROGRESS_APPLY_PROFILE: 131072,
    LIBRAW_PROGRESS_BAD_PIXELS: 64,
    LIBRAW_PROGRESS_CONVERT_RGB: 262144,
    LIBRAW_PROGRESS_DARK_FRAME: 128,
    LIBRAW_PROGRESS_FLIP: 65536,
    LIBRAW_PROGRESS_FOVEON_INTERPOLATE: 256,
    LIBRAW_PROGRESS_FUJI_ROTATE: 32768,
    LIBRAW_PROGRESS_HIGHLIGHTS: 16384,
    LIBRAW_PROGRESS_IDENTIFY: 2,
    LIBRAW_PROGRESS_INTERPOLATE: 2048,
    LIBRAW_PROGRESS_LOAD_RAW: 8,
    LIBRAW_PROGRESS_MEDIAN_FILTER: 8192,
    LIBRAW_PROGRESS_MIX_GREEN: 4096,
    LIBRAW_PROGRESS_OPEN: 1,
    LIBRAW_PROGRESS_PRE_INTERPOLATE: 1024,
    LIBRAW_PROGRESS_RAW2_IMAGE: 16,
    LIBRAW_PROGRESS_REMOVE_ZEROES: 32,
    LIBRAW_PROGRESS_SCALE_COLORS: 512,
    LIBRAW_PROGRESS_SIZE_ADJUST: 4,
    LIBRAW_PROGRESS_STAGE20: 1048576,
    LIBRAW_PROGRESS_STAGE21: 2097152,
    LIBRAW_PROGRESS_STAGE22: 4194304,
    LIBRAW_PROGRESS_STAGE23: 8388608,
    LIBRAW_PROGRESS_STAGE24: 16777216,
    LIBRAW_PROGRESS_STAGE25: 33554432,
    LIBRAW_PROGRESS_STAGE26: 67108864,
    LIBRAW_PROGRESS_STAGE27: 134217728,
    LIBRAW_PROGRESS_START: 0,
    LIBRAW_PROGRESS_STRETCH: 524288,
    LIBRAW_PROGRESS_THUMB_LOAD: 268435456,
    LIBRAW_PROGRESS_TRESERVED1: 536870912,
    LIBRAW_PROGRESS_TRESERVED2: 1073741824,
  })
}
export function LibRaw_rawspecial_t() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_RAWSPECIAL_NODP2Q_INTERPOLATEAF: 32,
    LIBRAW_RAWSPECIAL_NODP2Q_INTERPOLATERG: 16,
    LIBRAW_RAWSPECIAL_SONYARW2_ALLFLAGS: 15,
    LIBRAW_RAWSPECIAL_SONYARW2_BASEONLY: 1,
    LIBRAW_RAWSPECIAL_SONYARW2_DELTAONLY: 2,
    LIBRAW_RAWSPECIAL_SONYARW2_DELTATOVALUE: 8,
    LIBRAW_RAWSPECIAL_SONYARW2_DELTAZEROBASE: 4,
    LIBRAW_RAWSPECIAL_SONYARW2_NONE: 0,
    LIBRAW_RAWSPECIAL_SRAW_NO_INTERPOLATE: 128,
    LIBRAW_RAWSPECIAL_SRAW_NO_RGB: 64,
  })
}
export function LibRaw_rawspeed_bits_t() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_RAWSPEEDV1_FAILONUNKNOWN: 2,
    LIBRAW_RAWSPEEDV1_IGNOREERRORS: 4,
    LIBRAW_RAWSPEEDV1_USE: 1,
    LIBRAW_RAWSPEEDV3_FAILONUNKNOWN: 512,
    LIBRAW_RAWSPEEDV3_IGNOREERRORS: 1024,
    LIBRAW_RAWSPEEDV3_USE: 256,
  })
}
export function LibRaw_runtime_capabilities() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_CAPS_DNGSDK: 2,
    LIBRAW_CAPS_GPRSDK: 4,
    LIBRAW_CAPS_JPEG: 128,
    LIBRAW_CAPS_RAWSPEED: 1,
    LIBRAW_CAPS_RAWSPEED3: 256,
    LIBRAW_CAPS_RAWSPEED_BITS: 512,
    LIBRAW_CAPS_RPI6BY9: 32,
    LIBRAW_CAPS_UNICODEPATHS: 8,
    LIBRAW_CAPS_X3FTOOLS: 16,
    LIBRAW_CAPS_ZLIB: 64,
  })
}
export function LibRaw_sony_cameratypes() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_SONY_CameraType_UNKNOWN: 65535,
    LIBRAW_SONY_DSC: 1,
    LIBRAW_SONY_DSLR: 2,
    LIBRAW_SONY_ILCA: 6,
    LIBRAW_SONY_ILCE: 5,
    LIBRAW_SONY_NEX: 3,
    LIBRAW_SONY_SLT: 4,
  })
}
export function LibRaw_thumbnail_formats() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_THUMBNAIL_BITMAP: 2,
    LIBRAW_THUMBNAIL_BITMAP16: 3,
    LIBRAW_THUMBNAIL_H265: 6,
    LIBRAW_THUMBNAIL_JPEG: 1,
    LIBRAW_THUMBNAIL_JPEGXL: 7,
    LIBRAW_THUMBNAIL_LAYER: 4,
    LIBRAW_THUMBNAIL_ROLLEI: 5,
    LIBRAW_THUMBNAIL_UNKNOWN: 0,
  })
}
export function LibRaw_warnings() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_WARN_BAD_CAMERA_WB: 4,
    LIBRAW_WARN_BAD_DARKFRAME_DIM: 1024,
    LIBRAW_WARN_BAD_DARKFRAME_FILE: 512,
    LIBRAW_WARN_BAD_OUTPUT_PROFILE: 128,
    LIBRAW_WARN_DNGSDK_PROCESSED: 131072,
    LIBRAW_WARN_DNG_IMAGES_REORDERED: 262144,
    LIBRAW_WARN_DNG_STAGE2_APPLIED: 524288,
    LIBRAW_WARN_DNG_STAGE3_APPLIED: 1048576,
    LIBRAW_WARN_FALLBACK_TO_AHD: 32768,
    LIBRAW_WARN_NONE: 0,
    LIBRAW_WARN_NO_BADPIXELMAP: 256,
    LIBRAW_WARN_NO_EMBEDDED_PROFILE: 32,
    LIBRAW_WARN_NO_INPUT_PROFILE: 64,
    LIBRAW_WARN_NO_JPEGLIB: 16,
    LIBRAW_WARN_NO_METADATA: 8,
    LIBRAW_WARN_PARSEFUJI_PROCESSED: 65536,
    LIBRAW_WARN_RAWSPEED3_NOTLISTED: 16777216,
    LIBRAW_WARN_RAWSPEED3_PROBLEM: 2097152,
    LIBRAW_WARN_RAWSPEED3_PROCESSED: 8388608,
    LIBRAW_WARN_RAWSPEED3_UNSUPPORTED: 4194304,
    LIBRAW_WARN_RAWSPEED_PROBLEM: 4096,
    LIBRAW_WARN_RAWSPEED_PROCESSED: 16384,
    LIBRAW_WARN_RAWSPEED_UNSUPPORTED: 8192,
    LIBRAW_WARN_VENDOR_CROP_SUGGESTED: 33554432,
  })
}
export function LibRaw_whitebalance_code() {
  return __typ.enumLike(__typ.u32, {
    LIBRAW_WBI_AsShot: 81,
    LIBRAW_WBI_Auto: 82,
    LIBRAW_WBI_Auto1: 85,
    LIBRAW_WBI_Auto2: 86,
    LIBRAW_WBI_Auto3: 87,
    LIBRAW_WBI_Auto4: 88,
    LIBRAW_WBI_BW: 120,
    LIBRAW_WBI_Cloudy: 10,
    LIBRAW_WBI_Custom: 83,
    LIBRAW_WBI_Custom1: 90,
    LIBRAW_WBI_Custom2: 91,
    LIBRAW_WBI_Custom3: 92,
    LIBRAW_WBI_Custom4: 93,
    LIBRAW_WBI_Custom5: 94,
    LIBRAW_WBI_Custom6: 95,
    LIBRAW_WBI_D50: 23,
    LIBRAW_WBI_D55: 20,
    LIBRAW_WBI_D65: 21,
    LIBRAW_WBI_D75: 22,
    LIBRAW_WBI_Daylight: 1,
    LIBRAW_WBI_FL_D: 12,
    LIBRAW_WBI_FL_L: 16,
    LIBRAW_WBI_FL_N: 13,
    LIBRAW_WBI_FL_W: 14,
    LIBRAW_WBI_FL_WW: 15,
    LIBRAW_WBI_FineWeather: 9,
    LIBRAW_WBI_Flash: 4,
    LIBRAW_WBI_Fluorescent: 2,
    LIBRAW_WBI_FluorescentHigh: 66,
    LIBRAW_WBI_HT_Mercury: 67,
    LIBRAW_WBI_Ill_A: 17,
    LIBRAW_WBI_Ill_B: 18,
    LIBRAW_WBI_Ill_C: 19,
    LIBRAW_WBI_Kelvin: 254,
    LIBRAW_WBI_Measured: 110,
    LIBRAW_WBI_None: 65535,
    LIBRAW_WBI_Other: 255,
    LIBRAW_WBI_PC_Set1: 96,
    LIBRAW_WBI_PC_Set2: 97,
    LIBRAW_WBI_PC_Set3: 98,
    LIBRAW_WBI_PC_Set4: 99,
    LIBRAW_WBI_PC_Set5: 100,
    LIBRAW_WBI_Shade: 11,
    LIBRAW_WBI_StudioTungsten: 24,
    LIBRAW_WBI_Sunset: 64,
    LIBRAW_WBI_Tungsten: 3,
    LIBRAW_WBI_Underwater: 65,
    LIBRAW_WBI_Unknown: 0,
  })
}
export function __itimer_which() {
  return __typ.enumLike(__typ.u32, {
    ITIMER_PROF: 2,
    ITIMER_REAL: 0,
    ITIMER_VIRTUAL: 1,
  })
}
export function __u_char() {
  return __typ.u8;
}
export function __u_short() {
  return __typ.u16;
}
export function __u_int() {
  return __typ.u32;
}
export function __u_long() {
  return __typ.u64;
}
export function __int8_t() {
  return __typ.i8;
}
export function __uint8_t() {
  return __typ.u8;
}
export function __int16_t() {
  return __typ.i16;
}
export function __uint16_t() {
  return __typ.u16;
}
export function __int32_t() {
  return __typ.i32;
}
export function __uint32_t() {
  return __typ.u32;
}
export function __int64_t() {
  return __typ.i64;
}
export function __uint64_t() {
  return __typ.u64;
}
export function __int_least8_t() {
  return __int8_t();
}
export function __uint_least8_t() {
  return __uint8_t();
}
export function __int_least16_t() {
  return __int16_t();
}
export function __uint_least16_t() {
  return __uint16_t();
}
export function __int_least32_t() {
  return __int32_t();
}
export function __uint_least32_t() {
  return __uint32_t();
}
export function __int_least64_t() {
  return __int64_t();
}
export function __uint_least64_t() {
  return __uint64_t();
}
export function __quad_t() {
  return __typ.i64;
}
export function __u_quad_t() {
  return __typ.u64;
}
export function __intmax_t() {
  return __typ.i64;
}
export function __uintmax_t() {
  return __typ.u64;
}
export function __dev_t() {
  return __typ.u64;
}
export function __uid_t() {
  return __typ.u32;
}
export function __gid_t() {
  return __typ.u32;
}
export function __ino_t() {
  return __typ.u64;
}
export function __ino64_t() {
  return __typ.u64;
}
export function __mode_t() {
  return __typ.u32;
}
export function __nlink_t() {
  return __typ.u32;
}
export function __off_t() {
  return __typ.i64;
}
export function __off64_t() {
  return __typ.i64;
}
export function __pid_t() {
  return __typ.i32;
}
export function __clock_t() {
  return __typ.i64;
}
export function __rlim_t() {
  return __typ.u64;
}
export function __rlim64_t() {
  return __typ.u64;
}
export function __id_t() {
  return __typ.u32;
}
export function __time_t() {
  return __typ.i64;
}
export function __useconds_t() {
  return __typ.u32;
}
export function __suseconds_t() {
  return __typ.i64;
}
export function __suseconds64_t() {
  return __typ.i64;
}
export function __daddr_t() {
  return __typ.i32;
}
export function __key_t() {
  return __typ.i32;
}
export function __clockid_t() {
  return __typ.i32;
}
export function __timer_t() {
  return __typ.ptr(__typ.u32);
}
export function __blksize_t() {
  return __typ.i32;
}
export function __blkcnt_t() {
  return __typ.i64;
}
export function __blkcnt64_t() {
  return __typ.i64;
}
export function __fsblkcnt_t() {
  return __typ.u64;
}
export function __fsblkcnt64_t() {
  return __typ.u64;
}
export function __fsfilcnt_t() {
  return __typ.u64;
}
export function __fsfilcnt64_t() {
  return __typ.u64;
}
export function __fsword_t() {
  return __typ.i64;
}
export function __ssize_t() {
  return __typ.i64;
}
export function __syscall_slong_t() {
  return __typ.i64;
}
export function __syscall_ulong_t() {
  return __typ.u64;
}
export function __loff_t() {
  return __off64_t();
}
export function __caddr_t() {
  return __typ.ptr(__typ.u8);
}
export function __intptr_t() {
  return __typ.i64;
}
export function __socklen_t() {
  return __typ.u32;
}
export function __sig_atomic_t() {
  return __typ.i32;
}
export function _IO_lock_t() {
  return __typ.u32;
}
export function off_t() {
  return __off64_t();
}
export function _Float128() {
  return __typ.u128;
}
export function _Float32() {
  return __typ.f32;
}
export function _Float64() {
  return __typ.f64;
}
export function _Float32x() {
  return __typ.f64;
}
export function _Float64x() {
  return __typ.u128;
}
export function wchar_t() {
  return __typ.u32;
}
export function u_char() {
  return __u_char();
}
export function u_short() {
  return __u_short();
}
export function u_int() {
  return __u_int();
}
export function u_long() {
  return __u_long();
}
export function quad_t() {
  return __quad_t();
}
export function u_quad_t() {
  return __u_quad_t();
}
export function fsid_t() {
  return __fsid_t();
}
export function loff_t() {
  return __loff_t();
}
export function ino_t() {
  return __ino64_t();
}
export function dev_t() {
  return __dev_t();
}
export function gid_t() {
  return __gid_t();
}
export function mode_t() {
  return __mode_t();
}
export function nlink_t() {
  return __nlink_t();
}
export function uid_t() {
  return __uid_t();
}
export function pid_t() {
  return __pid_t();
}
export function id_t() {
  return __id_t();
}
export function daddr_t() {
  return __daddr_t();
}
export function caddr_t() {
  return __caddr_t();
}
export function key_t() {
  return __key_t();
}
export function clock_t() {
  return __clock_t();
}
export function clockid_t() {
  return __clockid_t();
}
export function time_t() {
  return __time_t();
}
export function timer_t() {
  return __timer_t();
}
export function ulong() {
  return __typ.u64;
}
export function ushort() {
  return __typ.u16;
}
export function uint() {
  return __typ.u32;
}
export function u_int8_t() {
  return __uint8_t();
}
export function u_int16_t() {
  return __uint16_t();
}
export function u_int32_t() {
  return __uint32_t();
}
export function u_int64_t() {
  return __uint64_t();
}
export function register_t() {
  return __typ.i64;
}
export function sigset_t() {
  return __sigset_t();
}
export function suseconds_t() {
  return __suseconds_t();
}
export function __fd_mask() {
  return __typ.i64;
}
export function fd_mask() {
  return __fd_mask();
}
export function blksize_t() {
  return __blksize_t();
}
export function blkcnt_t() {
  return __blkcnt64_t();
}
export function fsblkcnt_t() {
  return __fsblkcnt64_t();
}
export function fsfilcnt_t() {
  return __fsfilcnt64_t();
}
export function __tss_t() {
  return __typ.u32;
}
export function __thrd_t() {
  return __typ.u64;
}
export function pthread_t() {
  return __typ.u64;
}
export function pthread_key_t() {
  return __typ.u32;
}
export function pthread_once_t() {
  return __typ.i32;
}
export function pthread_spinlock_t() {
  return __typ.i32;
}
export function __compar_fn_t() {
  return __typ.u32;
}
export function float_t() {
  return __typ.f32;
}
export function double_t() {
  return __typ.f64;
}
export function _bindgen_ty_1() {
  return __typ.u32;
}
export function __itimer_which_t() {
  return __typ.i32;
}
export function int_least8_t() {
  return __int_least8_t();
}
export function int_least16_t() {
  return __int_least16_t();
}
export function int_least32_t() {
  return __int_least32_t();
}
export function int_least64_t() {
  return __int_least64_t();
}
export function uint_least8_t() {
  return __uint_least8_t();
}
export function uint_least16_t() {
  return __uint_least16_t();
}
export function uint_least32_t() {
  return __uint_least32_t();
}
export function uint_least64_t() {
  return __uint_least64_t();
}
export function int_fast8_t() {
  return __typ.i8;
}
export function int_fast16_t() {
  return __typ.i64;
}
export function int_fast32_t() {
  return __typ.i64;
}
export function int_fast64_t() {
  return __typ.i64;
}
export function uint_fast8_t() {
  return __typ.u8;
}
export function uint_fast16_t() {
  return __typ.u64;
}
export function uint_fast32_t() {
  return __typ.u64;
}
export function uint_fast64_t() {
  return __typ.u64;
}
export function intmax_t() {
  return __intmax_t();
}
export function uintmax_t() {
  return __uintmax_t();
}
export function __gwchar_t() {
  return __typ.u32;
}
export function INT64() {
  return __typ.i64;
}
export function UINT64() {
  return __typ.u64;
}
export function uchar() {
  return __typ.u8;
}
export function memory_callback() {
  return __typ.u32;
}
export function exif_parser_callback() {
  return __typ.u32;
}
export function data_callback() {
  return __typ.u32;
}
export function progress_callback() {
  return __typ.u32;
}
export function pre_identify_callback() {
  return __typ.u32;
}
export function post_identify_callback() {
  return __typ.u32;
}
export function process_step_callback() {
  return __typ.u32;
}
