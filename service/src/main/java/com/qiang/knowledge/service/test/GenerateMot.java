package com.qiang.knowledge.service.test;

import com.sun.jna.Native;
import com.sun.jna.ptr.IntByReference;

public class GenerateMot {
    public static void main(String[] args) {
        String dllPath="D:\\wb\\HYFcode\\20260417\\win\\CImageDetect.dll";
        NasalResamplingManager instance=(NasalResamplingManager) Native.loadLibrary(dllPath,NasalResamplingManager.class);
        IntByReference pnSampleNum=new IntByReference();
        byte[] pchSampleNames=new byte[100];
        IntByReference pnProStatusOut=new IntByReference();
        byte[]  pchMsg=new byte[1024];
        String pchSetPathIn="D:\\wb\\modelpic\\modelPath\\109058";  //(输入) 模板库文件夹位置
        String  pchModelNameIn="109058.mot";                                    //生成的mot名称
        String pchModelFileIn="D:\\wb\\modelpic\\modelPath\\109058\\109058.mot"; //生成的mot位置
        byte[] pbyVersionIn=new byte[3];
        int nSampleNameLenIn=3;
        int[] pnModelParasIn={1,1,1,1,0,0};
        instance.ProcessModelGenerate(pnSampleNum,pchSampleNames,pnProStatusOut,pchMsg,pchSetPathIn,
                pchModelFileIn,pchModelNameIn,pbyVersionIn,nSampleNameLenIn,pnModelParasIn);
    }
}
