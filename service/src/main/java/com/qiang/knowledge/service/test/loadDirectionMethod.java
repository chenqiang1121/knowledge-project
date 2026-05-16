package com.qiang.knowledge.service.test;

import com.sun.jna.Native;

import java.util.Arrays;

/**
 * 计算载荷在目标本体坐标系中的指向
 */
public class loadDirectionMethod {
    public static void main(String[] args) {
        String dllPath2="D:\\wb\\HYFCode\\HYFCode\\20260201\\win\\CImagePose.dll"; //window版本算法,另外一个函数，     (输入算法路径)
        String  pcSamplePathIn="D:\\wb\\pic\\10001\\3.jpg"; //图像位置                                       (输入单张图像路径)
        int[]  pnLimsIn={331,479,427,563};         //框选载荷的矩形框的框选部分坐标，共4位，分别为左上角坐标(宽度方向/高度方向) 右下角坐标(宽度方向/高度方向)    (输入矩形框选框的左上角坐标x,y值，右下角坐标xy值)
        float[] pfLoadCorOuts  =new float[4]; //载荷指向坐标，共4位，分别表示[起点横向坐标 起点纵向坐标 终点横向坐标 终点纵向坐标]，其中起点位置为载荷中心点。              （输出结果载荷法向量）
        float[] pfEllParaOuts  =new float[15]; //载荷边界拟合参数共5位，分别为[a-长半轴 b-短半轴 yc-中心高度坐标 xc中心宽度坐标 vangle-旋转角度 ],其中旋转角度为由短轴水平状态转至目标位置的角度
        NasalResamplingManager instance2=(NasalResamplingManager) Native.loadLibrary(dllPath2,NasalResamplingManager.class);
        int flag2=instance2.ProcessLoadDirection(pfLoadCorOuts,pfEllParaOuts,pcSamplePathIn,pnLimsIn);
        System.out.println("单位法向量坐标"+ Arrays.toString(pfLoadCorOuts));      // 计算载荷指向所需参数
        String dllPath="D:\\wb\\HYFCode\\HYFCode\\20260417\\win\\CImageDetect.dll"; //window版本算法                                                         (输入)
        float[] pfAttiAngleIns ={312.1f,24.7f,180.9f,325.9f,14.0f,180.5f,327.8f,3.9f,180.6f}; //各张图像姿态值，姿态估计方法得出的姿态值，           (输入姿态估计计算出的结果)
//        float[] pfPosDirIns ={399.65f,561.56f,413.87f,588.81f,
//                385.52f,541.87f,395.93f,575.76f,
//                380.18f,525.49f,383.78f,564.33f}; //各张图像的载荷投影坐标，就是载荷框选方法的出的两点坐标
        float[] pfPosDirIns ={398.28186f,560.7975f,398.81567f,561.6431f,
                386.2427f,541.3421f,386.54843f,542.2942f,
                380.52948f,525.2368f,380.6042f,526.234f}; //各张图像的载荷投影坐标，就是载荷框选方法的出的两点坐标                                    (输入loadDirectionMethod2算出的法向量)
        int nImageNumIn =3; //图像数目，要求至少为2
        float[] pfLoadDirs  =new float[3]; //载荷在目标本体坐标系中的指向，用三维空间坐标表示，表示从原点至该点的方向                                   （输出载荷指向结果）
        float[] pfConfis  =new float[nImageNumIn]; //各图载荷方向的置信度，位于-1 至 1 之间，-1 可信，0 不可信，负数-方向有误
        float[] pfAngleVar  =new float[1]; //最大偏差角度，计算出的载荷指向在全部图中的最大投影偏差角度
        NasalResamplingManager instance=(NasalResamplingManager) Native.loadLibrary(dllPath,NasalResamplingManager.class);
        int flag=instance.ProcessLoadDirection(pfLoadDirs,pfConfis,pfAngleVar,pfAttiAngleIns,pfPosDirIns,nImageNumIn);
        System.out.println("载荷指向结果"+ Arrays.toString(pfLoadDirs));

    }
}
