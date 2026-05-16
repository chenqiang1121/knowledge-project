package com.qiang.knowledge.service.test;


import com.sun.jna.Library;
import com.sun.jna.Memory;
import com.sun.jna.Pointer;
import com.sun.jna.ptr.DoubleByReference;
import com.sun.jna.ptr.IntByReference;

import java.util.Map;

public interface NasalResamplingManager extends Library {
    /**
     * @FileName NasalResamplingService.java
     * @description .so和dll算法接口
     * @author lanys
     * @date 2024-4-15 17:14:04
     */





    /**
     * 生成tra文件接口（生成三列数据）
     *
     * @param targetTlePath   目标tle文件地址 例：/home/20230915165255813.tle
     * @param observerTlePath 观测tle文件地址 例：/home/20230915165255814.tle
     * @param timePath        时间文件地址 例：/home/20230915165255814.time
     * @param outTraPath      输出tra文件地址: /home/
     *                        最后输出文件名为时间文件名称+.tra 例：/home/20230915165255814.time.tra
     * @return
     */
    int newGenerateTra(String targetTlePath, String observerTlePath, String timePath, String outTraPath);

    /**
     * 生成tra文件接口（生成五列数据）
     *
     * @param objectTle  目标tle文件地址    例：/home/20230915165255813.tle
     * @param observeTle 观测tle文件地址   例：/home/20230915165255814.tle
     * @param timePath   时间文件地址，例：/home/20230915165255814.time
     * @param outputPath 输出文件地址，例：/home/result_file/
     * @return
     */
    int newLightGenerateTra(String objectTle, String observeTle, String timePath, String outputPath);


    /**
     * 生成模板库接口
     */
    int newLightCalcul(String modelPath,String trePath,String outPath, String imgPath,int width,int height,double imgViewDis,double imgViewField,int isSave,int decFlg,float valError,int imgtype);
    /**
     * 生成mot文件接口
     */
    int ProcessModelGenerate(IntByReference ProcessModelGenerate,byte[]  pchSampleNames,IntByReference
            pnProStatusOut,byte[] pchMsg,String pchSetPathIn,String pchModelFileIn,String pchModelNameIn
            ,byte[] pbyVersionIn, int nSampleNameLenIn,int[] pnModelParasIn);
    /**
     * 姿态识别
     */
    int ProcessRecogSingle(IntByReference ProcessRecogSingle,short[] pusTargetIDSels, byte[]
            pchSampleNameSels, float[] pfRectXys, int[] pnAngles, float[] pfSepRes,float[]
                                   pfMatchRes, float[] pfAttitudes, IntByReference pnProStatusOut,byte[] pchMsg, String
                                   pchImgFileIn, String pchModelFileIn, int nMaxNumIn, int[] pnModelParasIn, float[]
                                   pfLableDirsIn, int byLableFlagIn);
    /**
     * 载荷指向计算,标注载荷法向量方法，（中心点到椭圆短边两个点的坐标）
     */
    int  ProcessLoadDirection(float[] pfLoadDirs,float[] pfConfis,  float[] pfAngleVar,float[] pfAttiAngleIns,float[] pfPosDirIns,int nImageNumIn);
    /**
     * 载荷指向计算,框选载荷坐标，（中心点到椭圆短边两个点的坐标）
     */
    int  ProcessLoadDirection(float[] pfLoadCorOuts, float[] pfEllParaOuts, String pchImageFileIn, int[] pnLimsIn);
}


