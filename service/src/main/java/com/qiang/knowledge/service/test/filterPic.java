package com.qiang.knowledge.service.test;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 生成的模板库改名
 */
public class filterPic {


    public static void main(String[] args) {
        String sourcePath="D:\\wb\\modelpic\\modelPath\\CircleLoadFidx";
        String tragetPath="D:\\wb\\modelpic\\modelPath\\10001";
        File srcDir=new File(sourcePath);
        File destDIr=new File(tragetPath);
        File[] bmpFiles=srcDir.listFiles(new FilenameFilter() {
            public boolean accept(File dir, String name) {
                return name.toLowerCase().endsWith(".bmp");
            }
        });
        for (File bmpFile : bmpFiles) {
            try {
                String originalName=bmpFile.getName().replaceFirst("\\.bmp$","");
                String[] parts=originalName.split("_");
                if (parts.length>=6){
                    StringBuilder sb=new StringBuilder();
                    sb.append(parts[1]).append("_").append(parts[2]).append("_").append(parts[3]).append("_").append(parts[4]).append("_0.bmp");
                    String newName=sb.toString();
                    File sourceFile=new File(srcDir,originalName+".bmp");
                    File destFile=new File(destDIr,newName);
                    Files.copy(sourceFile.toPath(),destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}
