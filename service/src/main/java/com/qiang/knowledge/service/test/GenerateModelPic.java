package com.qiang.knowledge.service.test;

import com.sun.jna.Native;

/**
 * 模板库生产算法，调用梓旭算法
 */

public class GenerateModelPic {
    public static void main(String[] args) {
        String modelPath="D:\\wb\\20260104fidx\\CircleLoadFidx\\";
        String traPath="D:\\wb\\1.tra";
        String outPath="D:\\wb\\modelpic\\outputPath\\";
        String imgPath="D:\\wb\\modelpic\\modelPath\\10001\\";
        String dllPath="D:\\wb\\htCalKernel.dll";
        NasalResamplingManager instanct = (NasalResamplingManager) Native.loadLibrary(dllPath, NasalResamplingManager.class);
        instanct.newLightCalcul(modelPath,traPath,outPath,imgPath,512,512,0.5,0.5,1,0,0,0);
    }
}
