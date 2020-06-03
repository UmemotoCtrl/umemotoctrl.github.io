#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
# import codecs

path = r'md/topMenu.md'
baseURL = r'https://umemotoctrl.github.io/'
sitemap = u'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n'

with open(path, 'r') as f:
# with codecs.open(path, 'r', 'utf-8') as f:
    # print(f)
    # s = repr(f.read())
    s = f.read()
    s = re.sub('<!--[\s\S]+?-->', '', s)
    result = re.findall(r'\[.+?\]\((.+?)\)', s)
    urlList = []
    priorityList = []
    for element in result:
        if not element.startswith('http'):
            if element == r'./':
                priorityList.append("%1.1f"%(1))
            else:
                priorityList.append("%1.1f"%(.8))
                # priorityList.append(baseURL+re.sub(r'\A\./', '', element))
            urlList.append(baseURL+re.sub(r'\A\./', '', element))
    for i in range(len(urlList)):
        temp1 = u'<url>\n<loc>'
        temp2 = u'</loc>\n<priority>'
        temp3 = u'</priority>\n<changefreq>monthly</changefreq>\n</url>\n'
        sitemap += temp1 + urlList[i] + temp2 + priorityList[i] + temp3
        # print(urlList[i])
        # print(priorityList[i])
    sitemap += u'</urlset>\n'
path = r'sitemap.xml'
with open(path, 'w') as f:
    f.write(sitemap)
    # print(sitemap)
    # <url>
    #   <loc>https://umemotoctrl.github.io/</loc>
    #   <priority>1.0</priority>
    #   <changefreq>monthly</changefreq>
    # </url>
    # raw_abc = r'Top'
    # text = "abcdefghijklmn"
    # result = re.match(raw_abc, s)
    # print(s)
    # print(type(s))
    # print(type(r'hgoe'))
    # pattern = re.compile('Top')
    # result = pattern.match(s)
    # result = re.match(s, 'Top')
    # result = re.match('Top', s)
    # result = re.match(r'\n-', s)
    # result = re.match('\[.+?\]', s)
    # result = re.match('<!--[\s\S]+?-->', s)
    # print(result.group())
    # for element in urlList:
    #     print(element)
    # for element in priorityList:
    #     print(element)
