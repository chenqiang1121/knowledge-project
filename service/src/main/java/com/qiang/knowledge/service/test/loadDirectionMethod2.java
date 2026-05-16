package com.qiang.knowledge.service.test;

import com.sun.jna.Memory;
import com.sun.jna.Native;
import com.sun.jna.ptr.IntByReference;

import java.util.Arrays;

/**
 * 计算单张载荷法向量
 */
public class loadDirectionMethod2 {
    public static void main(String[] args) {

        String dllPath="D:\\wb\\HYFcode\\20260201\\win\\CImagePose.dll"; //window版本算法,另外一个函数，     (输入算法路径)
        String  pcSamplePathIn="D:\\wb\\pic\\10001\\3.jpg"; //图像位置                                       (输入单张图像路径)
        int[]  pnLimsIn={331,479,427,563};         //框选载荷的矩形框的框选部分坐标，共4位，分别为左上角坐标(宽度方向/高度方向) 右下角坐标(宽度方向/高度方向)    (输入矩形框选框的左上角坐标x,y值，右下角坐标xy值)
        float[] pfLoadCorOuts  =new float[4]; //载荷指向坐标，共4位，分别表示[起点横向坐标 起点纵向坐标 终点横向坐标 终点纵向坐标]，其中起点位置为载荷中心点。              （输出结果载荷法向量）
        float[] pfEllParaOuts  =new float[15]; //载荷边界拟合参数共5位，分别为[a-长半轴 b-短半轴 yc-中心高度坐标 xc中心宽度坐标 vangle-旋转角度 ],其中旋转角度为由短轴水平状态转至目标位置的角度
        NasalResamplingManager instance=(NasalResamplingManager) Native.loadLibrary(dllPath,NasalResamplingManager.class);
        int flag=instance.ProcessLoadDirection(pfLoadCorOuts,pfEllParaOuts,pcSamplePathIn,pnLimsIn);
        System.out.println("单位法向量坐标"+ Arrays.toString(pfLoadCorOuts));      // 计算载荷指向所需参数
    }
}
