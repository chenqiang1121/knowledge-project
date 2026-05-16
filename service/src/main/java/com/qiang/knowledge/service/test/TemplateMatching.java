package com.qiang.knowledge.service.test;

import com.sun.jna.Native;
import com.sun.jna.ptr.IntByReference;

import java.util.Arrays;

/**
 * 胡亚峰姿态估计算法
 *现行方法为标两根线与三根根线，优化求解和直接解算单张图像的
 */
public class TemplateMatching {
    public static void main(String[] args) {
        String dllPath="D:\\wb\\HYFCode\\dll\\CImageDetect.dll";              //（输入）window版本算法
        String pchImageFileIn="D:\\wb\\pic\\SBIRS-5\\50.png";   //       （输入）图像地址
        String pchModelFileIn="D:\\wb\\modelPic\\modelPic\\SB5\\model_SB5_v2_3_4.mot"; //      （输入）mot文件
        //标注线坐标，共3*4=12位，[电池板 垂直 主体]*[起点 x/y 终点x/y]                     （输入） xyz三轴起始终点坐标
//        float[] pfLableDirsIn={202.64f,46.52f,85.39f,343.48f,
//                202.64f,46.52f,250.76f,86.67f,
//                140.51f,242.79f,189.58f,243.11f};
                float[] pfLableDirsIn={0.0f,0.0f,0.0f,0.0f,
                202.64f,46.52f,250.76f,86.67f,
               140.51f,242.79f,189.58f,243.11f};
        int byLableFlagIn =1;//标注线属性，0/1/2-不使用标识线/用于优化/优先直接解算
        int attitudes=3;
        float[]  pfAttitudes=new float[attitudes]; //                           （输出）输出三个姿态值
        int nMaxNumIn=3;
        int sample_name_length=100;
        int msg_length=1024;
        int rect_xy_size=100;
        int angles_size=6;
        int sep_res_siez=50;
        int maxMatches=50;
        NasalResamplingManager instance=(NasalResamplingManager) Native.loadLibrary(dllPath,NasalResamplingManager.class);
        IntByReference pnNumSel=new IntByReference(0);
        short[] pusTargetIDSels=new short[maxMatches*rect_xy_size];
        byte[] pchSampleNameSels=new byte[maxMatches*sample_name_length];
        float[] pfRectXys=new float[rect_xy_size];
        int[] pnAngles=new int[angles_size];
        float[] pfSepRes=new float[sep_res_siez];
        float[] pfMatchRes=new float[maxMatches*6];
        IntByReference pnProStatusOut=new IntByReference(0);
        byte[] pchMsg=new byte[msg_length];
        int[] pnModelParasIn={1,1,1,1,0};
        int flag=instance.ProcessRecogSingle(pnNumSel,pusTargetIDSels,pchSampleNameSels,
                pfRectXys,pnAngles,pfSepRes,pfMatchRes,
                pfAttitudes,pnProStatusOut,pchMsg,pchImageFileIn,
                pchModelFileIn,nMaxNumIn,pnModelParasIn,
                pfLableDirsIn,byLableFlagIn);
        System.out.println(new String(pchMsg).trim());
        //匹配图像
        System.out.println(new String(pchSampleNameSels).trim());
        System.out.println("姿态估计结果"+Arrays.toString(pfAttitudes));
    }
}
